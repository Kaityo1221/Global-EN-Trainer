"use strict";

(() => {
  const STORAGE_KEY = "getDailyTrainingV1";
  const QUIZ_SIZE = 3;

  let context = null;
  let pendingAnswer = false;

  function getDateKey(date = new Date()){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,"0");
    const day = String(date.getDate()).padStart(2,"0");
    return `${year}-${month}-${day}`;
  }

  function getPreviousDateKey(dateKey){
    const [year,month,day] = dateKey.split("-").map(Number);
    const date = new Date(year,month - 1,day);
    date.setDate(date.getDate() - 1);
    return getDateKey(date);
  }

  function hashText(text){
    let hash = 2166136261;

    for(let index = 0; index < text.length; index++){
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash,16777619);
    }

    return hash >>> 0;
  }

  function createRandom(seed){
    let value = seed >>> 0;

    return () => {
      value = (Math.imul(value,1664525) + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function shuffled(items,seed){
    const result = [...items];
    const random = createRandom(seed);

    for(let index = result.length - 1; index > 0; index--){
      const swapIndex = Math.floor(random() * (index + 1));
      [result[index],result[swapIndex]] = [result[swapIndex],result[index]];
    }

    return result;
  }

  function loadStore(){
    const saved = localStorage.getItem(STORAGE_KEY);

    if(!saved){
      return {
        version:1,
        days:{},
        streak:{current:0,best:0,lastCompletedDate:null}
      };
    }

    try{
      const parsed = JSON.parse(saved);
      return {
        version:1,
        days:parsed.days && typeof parsed.days === "object" ? parsed.days : {},
        streak:{
          current:Number(parsed.streak?.current) || 0,
          best:Number(parsed.streak?.best) || 0,
          lastCompletedDate:parsed.streak?.lastCompletedDate || null
        }
      };
    }catch(error){
      console.warn("Daily Training data could not be read.",error);
      return {
        version:1,
        days:{},
        streak:{current:0,best:0,lastCompletedDate:null}
      };
    }
  }

  function saveStore(store){
    const dateKeys = Object.keys(store.days).sort().slice(-90);
    const trimmedDays = {};

    dateKeys.forEach(key => {
      trimmedDays[key] = store.days[key];
    });

    store.days = trimmedDays;
    localStorage.setItem(STORAGE_KEY,JSON.stringify(store));
  }

  function createQuestions(allPokemon,dateKey){
    const chosen = shuffled(
      allPokemon,
      hashText(dateKey + "-questions")
    ).slice(0,QUIZ_SIZE);

    return chosen.map((pokemon,index) => {
      const otherNames = allPokemon
        .filter(item => item.en !== pokemon.en)
        .map(item => item.en);
      const wrongChoices = shuffled(
        otherNames,
        hashText(`${dateKey}-${pokemon.no}-${index}-wrong`)
      ).slice(0,3);
      const choices = shuffled(
        [pokemon.en,...wrongChoices],
        hashText(`${dateKey}-${pokemon.no}-${index}-choices`)
      );

      return {
        no:String(pokemon.no),
        jp:pokemon.jp,
        en:pokemon.en,
        choices
      };
    });
  }

  function ensureDayState(store,dateKey,questions){
    const existing = store.days[dateKey];
    const questionNos = questions.map(question => question.no);

    if(
      existing &&
      Array.isArray(existing.questionNos) &&
      existing.questionNos.join(",") === questionNos.join(",")
    ){
      existing.answers = Array.isArray(existing.answers)
        ? existing.answers.slice(0,QUIZ_SIZE)
        : [];
      existing.phraseReviewed = Boolean(existing.phraseReviewed);
      existing.completed = Boolean(existing.completed);
      return existing;
    }

    const created = {
      questionNos,
      answers:[],
      phraseReviewed:false,
      completed:false,
      completedAt:null
    };

    store.days[dateKey] = created;
    return created;
  }

  function getDailyPhrase(dateKey){
    const phrases = Array.isArray(window.GET_CA_PHRASES)
      ? window.GET_CA_PHRASES
      : [];

    if(!phrases.length){
      return {
        scene:"CA ENGLISH",
        en:"Welcome! Thanks for joining us today.",
        jp:"ようこそ！今日は参加してくれてありがとうございます。"
      };
    }

    return phrases[hashText(dateKey + "-phrase") % phrases.length];
  }

  function getScore(dayState){
    return dayState.answers.filter(answer => answer.correct).length;
  }

  function updateStreak(store,dateKey){
    const streak = store.streak;

    if(streak.lastCompletedDate === dateKey){
      return;
    }

    if(streak.lastCompletedDate === getPreviousDateKey(dateKey)){
      streak.current += 1;
    }else{
      streak.current = 1;
    }

    streak.best = Math.max(streak.best,streak.current);
    streak.lastCompletedDate = dateKey;
  }

  function completeDay(){
    const {store,dateKey,dayState} = context;

    if(dayState.completed){
      return;
    }

    dayState.completed = true;
    dayState.completedAt = new Date().toISOString();
    updateStreak(store,dateKey);
    saveStore(store);
  }

  function getSheepMessage(){
    const {dayState,store} = context;
    const hour = new Date().getHours();
    const weekday = new Date().getDay();

    if(dayState.completed){
      return `今日も完了！ ${store.streak.current}日連続だよ。明日もここで待ってるね。`;
    }

    if(dayState.answers.length > 0){
      const remaining = QUIZ_SIZE - dayState.answers.length;
      return remaining > 0
        ? `いい調子！ あと${remaining}問でCAフレーズへ進めるよ。`
        : "3問おつかれさま。最後に今日のCAフレーズを声に出してみよう。";
    }

    if(hour < 11){
      return "おはよう！ 3分だけ英語のスイッチを入れよう。";
    }

    if(weekday === 5){
      return "金曜日まで来たね。今日の3問で気持ちよく締めよう。";
    }

    if(weekday === 0 || weekday === 6){
      return "週末の現場を想像しながら、今日の英語をひとつ持っていこう。";
    }

    return "今日の積み重ねは小さくていい。まずは1問目から始めよう。";
  }

  function formatDisplayDate(){
    return new Intl.DateTimeFormat("ja-JP",{
      month:"long",
      day:"numeric",
      weekday:"short"
    }).format(new Date());
  }

  function updateHeader(){
    const {store,dayState} = context;
    const date = document.getElementById("dailyDate");
    const streak = document.getElementById("dailyStreak");
    const best = document.getElementById("dailyBest");
    const message = document.getElementById("dailySheepMessage");

    if(date) date.textContent = formatDisplayDate();
    if(streak) streak.textContent = `${store.streak.current}日`;
    if(best) best.textContent = `BEST ${store.streak.best}日`;
    if(message) message.textContent = getSheepMessage();

    const quizRatio = dayState.answers.length / QUIZ_SIZE;
    const completedUnits = 1 + quizRatio + (dayState.phraseReviewed ? 1 : 0);
    const percent = Math.round((completedUnits / 3) * 100);
    const fill = document.getElementById("dailyProgressFill");
    const label = document.getElementById("dailyProgressText");

    if(fill) fill.style.width = `${percent}%`;
    if(label){
      label.textContent = dayState.completed
        ? "TODAY COMPLETE"
        : `${Math.min(99,percent)}% COMPLETE`;
    }
  }

  function renderPokemonStep(){
    const {dailyPokemon} = context;
    const name = document.getElementById("dailyPokemonName");
    const jp = document.getElementById("dailyPokemonJp");
    const type = document.getElementById("dailyPokemonType");

    if(name) name.textContent = dailyPokemon.en;
    if(jp) jp.textContent = dailyPokemon.jp;
    if(type) type.textContent = (dailyPokemon.types || ["ノーマル"]).join(" / ");
  }

  function renderQuiz(){
    const {dayState,questions} = context;
    const quizSection = document.getElementById("dailyQuizStep");
    const phraseSection = document.getElementById("dailyPhraseStep");
    const completion = document.getElementById("dailyCompletion");

    if(dayState.completed){
      if(quizSection) quizSection.hidden = true;
      if(phraseSection) phraseSection.hidden = true;
      if(completion) completion.hidden = false;
      renderCompletion();
      return;
    }

    if(completion) completion.hidden = true;

    if(dayState.answers.length >= QUIZ_SIZE){
      if(quizSection) quizSection.hidden = true;
      if(phraseSection) phraseSection.hidden = false;
      renderPhrase();
      return;
    }

    if(quizSection) quizSection.hidden = false;
    if(phraseSection) phraseSection.hidden = true;

    const index = dayState.answers.length;
    const question = questions[index];
    const counter = document.getElementById("dailyQuizCounter");
    const questionElement = document.getElementById("dailyQuizQuestion");
    const options = document.getElementById("dailyQuizOptions");
    const feedback = document.getElementById("dailyQuizFeedback");
    const nextButton = document.getElementById("dailyQuizNext");

    pendingAnswer = false;
    if(counter) counter.textContent = `${index + 1} / ${QUIZ_SIZE}`;
    if(questionElement) questionElement.textContent = question.jp;
    if(feedback){
      feedback.textContent = "";
      feedback.className = "daily-quiz-feedback";
    }
    if(nextButton){
      nextButton.hidden = true;
      nextButton.disabled = true;
    }

    if(!options){
      return;
    }

    options.innerHTML = "";

    question.choices.forEach(choice => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "daily-answer-button";
      button.textContent = choice;
      button.addEventListener("click",() => answerQuestion(choice,button));
      options.appendChild(button);
    });
  }

  function answerQuestion(choice,clickedButton){
    if(pendingAnswer){
      return;
    }

    pendingAnswer = true;
    const {dayState,questions,store} = context;
    const question = questions[dayState.answers.length];
    const correct = choice === question.en;

    dayState.answers.push({
      no:question.no,
      selected:choice,
      correct,
      answeredAt:new Date().toISOString()
    });
    saveStore(store);

    document.querySelectorAll(".daily-answer-button").forEach(button => {
      button.disabled = true;

      if(button.textContent === question.en){
        button.classList.add("is-correct");
      }else if(button === clickedButton){
        button.classList.add("is-wrong");
      }
    });

    const feedback = document.getElementById("dailyQuizFeedback");
    const nextButton = document.getElementById("dailyQuizNext");

    if(feedback){
      feedback.textContent = correct
        ? "Correct! その調子。"
        : `正解は ${question.en}`;
      feedback.className = `daily-quiz-feedback ${correct ? "is-correct" : "is-wrong"}`;
    }

    if(nextButton){
      nextButton.hidden = false;
      nextButton.disabled = false;
      nextButton.textContent = dayState.answers.length >= QUIZ_SIZE
        ? "CAフレーズへ"
        : "次の問題";
    }

    updateHeader();
  }

  function renderPhrase(){
    const {phrase} = context;
    const scene = document.getElementById("dailyPhraseScene");
    const en = document.getElementById("dailyPhraseEn");
    const jp = document.getElementById("dailyPhraseJp");

    if(scene) scene.textContent = phrase.scene;
    if(en) en.textContent = phrase.en;
    if(jp) jp.textContent = phrase.jp;
  }

  function speakPhrase(){
    if(!context?.phrase || !("speechSynthesis" in window)){
      return;
    }

    const settings = typeof window.getAppSettings === "function"
      ? window.getAppSettings()
      : {speechRate:0.9};
    const utterance = new SpeechSynthesisUtterance(context.phrase.en);
    utterance.lang = "en-US";
    utterance.rate = Number(settings.speechRate) || 0.9;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function reviewPhrase(){
    const {dayState,store} = context;
    dayState.phraseReviewed = true;
    completeDay();
    saveStore(store);
    updateHeader();
    renderQuiz();
  }

  function renderCompletion(){
    const {dayState,store} = context;
    const score = document.getElementById("dailyCompletionScore");
    const streak = document.getElementById("dailyCompletionStreak");

    if(score) score.textContent = `${getScore(dayState)} / ${QUIZ_SIZE}`;
    if(streak) streak.textContent = `${store.streak.current}日連続`;
  }

  function bindEvents(){
    const nextButton = document.getElementById("dailyQuizNext");
    const phraseSpeak = document.getElementById("dailyPhraseSpeak");
    const phraseDone = document.getElementById("dailyPhraseDone");
    const pokemonDetail = document.getElementById("dailyPokemonDetail");

    if(nextButton){
      nextButton.addEventListener("click",renderQuiz);
    }

    if(phraseSpeak){
      phraseSpeak.addEventListener("click",speakPhrase);
    }

    if(phraseDone){
      phraseDone.addEventListener("click",reviewPhrase);
    }

    if(pokemonDetail){
      pokemonDetail.addEventListener("click",() => {
        const keyword = encodeURIComponent(context.dailyPokemon.en);
        window.location.href = `pages/namebank.html?search=${keyword}`;
      });
    }
  }

  async function initialize(){
    const dashboard = document.getElementById("dailyDashboard");

    if(!dashboard || !window.GETPokemonData){
      return;
    }

    try{
      const [allPokemon,daily] = await Promise.all([
        window.GETPokemonData.getAllPokemon(),
        window.GETPokemonData.getDailyPokemon()
      ]);
      const dateKey = getDateKey();
      const questions = createQuestions(allPokemon,dateKey);
      const store = loadStore();
      const dayState = ensureDayState(store,dateKey,questions);

      context = {
        dateKey,
        questions,
        dailyPokemon:daily.pokemon,
        phrase:getDailyPhrase(dateKey),
        store,
        dayState
      };

      saveStore(store);
      bindEvents();
      renderPokemonStep();
      updateHeader();
      renderQuiz();
      dashboard.classList.add("is-ready");
    }catch(error){
      console.error("Daily Training initialization failed.",error);
      dashboard.classList.add("is-error");
      const message = document.getElementById("dailySheepMessage");
      if(message){
        message.textContent = "今日のトレーニングを読み込めなかったよ。通信状態を確認してね。";
      }
    }
  }

  document.addEventListener("DOMContentLoaded",initialize);
})();
