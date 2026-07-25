# React + Vite

## 每日访问暗号

开屏暗号由 Vercel Function 根据北京时间和私密种子生成。暗号只在服务端验证；
验证成功后签发 4 小时有效、`HttpOnly`、`Secure`、`SameSite=Strict` 的会话 Cookie。
Routing Middleware 会在缓存和静态文件之前检查会话，因此页面、JS、图片、PDF 和音频都在同一访问边界后。

1. 复制 `.env.example` 为 `.env.local`。
2. 为 `SITE_ACCESS_SECRET` 设置一个至少 32 字节的随机值，并在 Vercel 项目中配置同名环境变量。
3. 运行 `npm run code:today` 查看当天需要发送给已付款访客的暗号。

生产环境必须配置 `SITE_ACCESS_SECRET`，否则验证接口和受保护资源都保持关闭。
`ACCESS_CODE_PREFIX` 可选，默认值为 `HQ`。当前日期只接受当天暗号，不提供前一天宽限。

公开例外仅包括开屏页、两只业务邮箱、`robots.txt` 和去身份化的 GEO 文档。
个人电话、社交账号和个人二维码不得放入仓库或部署产物。

## 隔离实验

`public/project06` 仍作为本地迁移源保留，但生产构建结束后会从 `dist` 删除。Railroad 等涉及
图片、语音或对话的实验必须在独立域名上完成明确同意、默认不保存、到期和删除机制后再部署。

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
