# GET - Global EN Trainer

Pokémonの英語名を、検索・クイズ・ゲームで楽しく覚えるためのブラウザ学習アプリです。v1.0では、毎朝3分で学べるCommunity Ambassador向け実戦英語アプリを目指しています。

## Features

### Daily Training

- ホームを開いて約3分で完了する毎日の学習セット
- Today's Pokémon、3問クイズ、CA Englishの3段階
- 日付ごとに問題とフレーズを固定
- 回答途中からの再開
- 連続学習日数と自己ベストを端末へ保存
- 曜日、時刻、進行状況に応じたGET Sheepメッセージ
- 90日分の日次履歴を保持

### Today's Pokémon

- 日付に応じて毎日1匹を表示
- 英語名・日本語名・図鑑番号・タイプを確認
- Name Bankの該当ポケモンへ直接移動
- `data/gen1.json`〜`gen9.json`を正本として使用

### CA English

- Community Ambassadorの現場を想定した短い英語案内
- Check-in、集合、移動、レイド、安全、混雑、初参加者対応など
- 英文と日本語訳を表示
- Settingsの速度を使った英語音声読み上げ
- 日替わりフレーズとしてDaily Trainingへ組み込み

### Name Bank

- 第1世代から第9世代まで対応
- 英語名・日本語名・図鑑番号で検索
- 世代別・タイプ別の複合フィルター
- 英語名の音声読み上げ
- タイプに応じたカード背景

### Daily Quiz

- ポケモンの日本語名から英語名を選ぶ4択クイズ
- 1回10問
- タイプ別の正解演出
- 回答後は自動で次の問題へ進行

### EN Quest / NAME ARENA

- ゲームマップ形式の学習メニュー
- HP制、18秒タイマー、連続正解コンボ
- 5・10・15・20コンボのカットイン
- JunPoko秘密コマンドと6つの解除ミッション

### Settings

- 読み上げ速度
- BGMのON/OFFと音量
- 動きを減らす表示設定
- 設定データと学習進行データのリセット

### App Foundation

- 共通アプリバー
- 5タブの下部ナビゲーション
- iPhoneセーフエリア対応
- オンライン・オフライン状態表示
- Web App Manifest
- Service Workerによるオフラインキャッシュ
- ホーム画面からのスタンドアロン起動

## Architecture

### Shared application shell

ルート直下の`script.js`が、通常ページへ共通アプリバーと下部ナビゲーションを追加し、PWA登録とオンライン状態管理を行います。

### Daily Training

- `js/daily-training.js`: 日次問題、進行、連続日数、途中再開を管理
- `data/ca-phrases.js`: CA実戦英語のフレーズ集
- `css/daily-home.css`: ホーム専用のDaily Training UI
- Local Storageキー: `getDailyTrainingV1`

### Pokémon data

ポケモンデータの正本は以下の9ファイルです。

```text
data/gen1.json
data/gen2.json
...
data/gen9.json
```

`js/pokemon-data.js`が9ファイルを一度だけ読み込み、Today's Pokémon、Name Bank、Daily Training、Daily Quiz、NAME ARENAへ共有します。`data/todayPokemon.js`は互換性確認用の旧ファイルで、新しい画面からは読み込みません。

### PWA

- `manifest.webmanifest`: ホーム画面アプリ情報
- `sw.js`: アプリシェル、画面、ポケモンデータ、CA英語のキャッシュ
- `offline.html`: 通信不能時のフォールバック
- `css/foundation.css`: セーフエリア、共通ナビ、デザイントークン

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Web Speech API
- Local Storage
- Service Worker / Cache Storage
- Web App Manifest
- GitHub Pagesを想定した静的構成

## Project Structure

```text
Global-EN-Trainer/
├─ index.html
├─ manifest.webmanifest
├─ offline.html
├─ sw.js
├─ style.css
├─ script.js
├─ assets/
├─ css/
│  ├─ foundation.css
│  └─ daily-home.css
├─ data/
│  ├─ ca-phrases.js
│  ├─ gen1.json
│  ├─ ...
│  └─ gen9.json
├─ js/
│  ├─ daily-training.js
│  ├─ pokemon-data.js
│  └─ ...
└─ pages/
```

## Run Locally

Service WorkerとJSONの`fetch()`を利用するため、HTMLファイルを直接開かずローカルサーバーで起動してください。

```bash
python -m http.server 8000
```

ブラウザで`http://localhost:8000`を開きます。

## Version

Current version: **v0.4.0 / v1.0 Phase 2**

## Issue Numbering

改良計画シートの番号とGitHub Issue番号が衝突しないよう、次の表記を使用します。

- 改良計画シート: `GET-013`
- GitHub Issue / Pull Request: `GH-68` / `PR-xx`

## Status

Active development. v1.0 roadmap: GitHub Issue #68.
