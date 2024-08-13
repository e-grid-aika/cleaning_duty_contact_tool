# TypeScriptとClaspでのGAS開発環境テンプレート

## 環境構築手順
1. package.jsonファイルの作成

```
npm init -y
```

2. 必要なパッケージのインストール
    1. typescript：TypeScript
    2. @google/clasp：clasp
    3. @types/google-apps-script：GASで使うTypescript用の型定義ファイル

```
npm install -D clasp typescript @google/clasp @types/google-apps-script
```

3. tsconfigの作成

```
npx tsc --init
```

4. tsconfig.jsonに以下を追加

```
"compilerOptions": {
    "lib": ["esnext"],
    "experimentalDecorators": true　//元々コメントアウトされているものを有効化する
  }
```

5. esbuildのインストール

```
npm install -D esbuild esbuild-gas-plugin
```

# 参考
[TypeScript+clasp+esbuildでGASのローカル開発をもっと便利に](https://zenn.dev/funteractiveinc/articles/776b5812833475#esbuild%E3%81%AE%E5%88%A9%E7%94%A8%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6)


# jestによるテストの実行
1. ```npm install -g yarn```
2. ```yarn add -D jest ts-jest @types/jest```
https://typescriptbook.jp/tutorials/jest
