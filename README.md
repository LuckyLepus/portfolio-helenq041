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

## Meta Lab

Meta 页面只保留两个低数据风险实验：

- 在线绘本：纯静态 HTML、图片与浏览器端音频。
- Backrooms 手势控制：点击明确同意后才开启摄像头，视频帧仅在当前标签页本地处理；不上传、
  不保存，停止按钮或切换标签页会释放摄像头。

Backrooms 源码位于 `experiments/backrooms`，生产产物输出到 `public/lab/backrooms`。
原 Gemini Railroad 对话树洞已下线，改写为不连接模型、不收集访问者数据的静态设计笔记。
构建脚本仍会删除任何遗留的 `dist/project06` 内容。

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
