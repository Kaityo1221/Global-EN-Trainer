# GET - Global EN Trainer

Pokémonの英語名を、検索・クイズ・ゲームで楽しく覚えるためのブラウザ学習アプリです。

## Features

### Today's Pokémon

- 日付に応じて毎日1匹を表示
- 英語名・日本語名・図鑑番号・タイプを確認
- Name Bankの該当ポケモンへ直接移動

### Name Bank

- 第1世代から第9世代まで対応
- 英語名・日本語名・図鑑番号で検索
- 世代別フィルター
- タイプ別フィルター
- 英語名の音声読み上げ
- タイプに応じたカード背景

### Daily Quiz

- ポケモンの日本語名から英語名を選ぶ4択クイズ
- 1回10問
- タイプ別の正解演出
- 回答後は自動で次の問題へ進行

### EN Quest

- ゲームマップ形式の学習メニュー
- NAME ARENAを実装
- JunPoko秘密コマンドと6つの解除ミッション

### NAME ARENA

- 4択形式の英語名バトル
- HP制
- 18秒タイマー
- 連続正解コンボ
- 5・10・15・20コンボのカットイン
- 英語音声読み上げ

### Settings

- 読み上げ速度
- BGMのON/OFF
- BGM音量
- 動きを減らす表示設定
- 設定データのリセット
- 学習・JunPoko進行データのリセット

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Web Speech API
- Local Storage
- GitHub Pagesを想定した静的構成

## Project Structure

```text
Global-EN-Trainer/
├─ index.html
├─ style.css
├─ script.js
├─ assets/
├─ css/
├─ data/
│  ├─ gen1.json
│  ├─ ...
│  └─ gen9.json
├─ js/
└─ pages/
```

## Run Locally

JSONデータを`fetch()`で読み込むため、HTMLファイルを直接開くのではなくローカルサーバーで起動してください。

```bash
python -m http.server 8000
```

ブラウザで `http://localhost:8000` を開きます。

## Version

Current version: **v0.2.0**

## Issue Numbering

改良計画シートの番号とGitHub Issue番号が衝突しないよう、次の表記を使用します。

- 改良計画シート: `GET-013`
- GitHub Issue / Pull Request: `GH-23` / `PR-67`

## Status

Active development.
