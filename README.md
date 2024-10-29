# TypeScript と Clasp での GAS 開発環境テンプレート

## 環境構築手順

1. devcontainer の作成
   devcontainer.json と Dockerfile が作成される。
   devcontainer.json の remoteUser が root になっていることを確認
   (root になっていないとコンテナ内に入った後、ファイルの編集権限がない状態になる)
2. package.json ファイルの作成

```
npm init -y
```

3. 必要なパッケージのインストール
   1. typescript：TypeScript
   2. @google/clasp：clasp
   3. @types/google-apps-script：GAS で使う Typescript 用の型定義ファイル

```
npm install -D clasp typescript @google/clasp @types/google-apps-script
```

4. tsconfig の作成

```
npx tsc --init
```

5. tsconfig.json に以下を追加

```
"compilerOptions": {
    "lib": ["esnext"]
    "experimentalDecorators": true　//元々コメントアウトされているものを有効化する
  }
```

6. esbuild のインストール

```
npm install -D esbuild esbuild-gas-plugin
```

# 参考

[TypeScript+clasp+esbuild で GAS のローカル開発をもっと便利に](https://zenn.dev/funteractiveinc/articles/776b5812833475#esbuild%E3%81%AE%E5%88%A9%E7%94%A8%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)

# jest によるテストの実行

1. `npm install -g yarn`
2. `yarn add -D jest ts-jest @types/jest`
   https://typescriptbook.jp/tutorials/jest

# スクリプトの実行

`npm run ○○○`で packge.json の scripts に登録してあるスクリプトを実行する

# エラーの発生

- 実行済みのトリガーが Apps Script のトリガーページに残ったままになり、管理者のアカウントにトリガーが多すぎるとの警告メールが何度もくる
  - 対策：終了したトリガーを手作業で削除する

# フロー

1. main：cleaningDutyBot がプロパティで設定した時間に実行されるトリガーを作成(setTrigger()関数)
2. cleaningDutyBot() Chatwork から掃除当番を知らせるメッセージを送る関数
