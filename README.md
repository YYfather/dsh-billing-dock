# dsh-billing-dock

DSH 侧栏左下角的常驻电费浮层：**今日电费 / 电费余额 / 当前倍率与换档倒计时**，跟随宿主深浅色（深色青柠、浅色蓝字）。从 Fairy 皮肤里独立出来的单插件，不含皮肤、语音、开机动画。

## 功能

- 今日电费：按每笔请求发生时刻的峰谷价计费（工作日 09–12、14–18 为十倍，其余五倍）
- 电费余额：读 DSH 内置 `ctx.remote.account`，不碰密钥文件
- 倍率与倒计时：显示当前倍率、下一次换档时刻与剩余时长
- 位置：贴侧栏底部，侧栏收起时自动淡出；20s 轮询一次，换档前会补刷
- 主题：跟随宿主 light/dark，不反向修改宿主主题

## 数据来源

`<DSH_HOME>/sessions/<项目>/<会话>/session.v4.jsonl.zstd`，多帧 zstd 拼接；只读 `assistant/message` 的 `data.usage`。解析器已内联在 `usage.js`（从 @sky_wing_dn/dsh-fairy-zzz 的 MIT 代码抽出并去掉无关依赖）。

宿主路由：`GET /billing/usage`（`?diag=1` 返回日志目录与缓存诊断）。

## 安装

`link:` 本地目录或 npm 包，两种方式都需要把包名加进 profile 的 `dsh.profile.bundles`：

```json
"dependencies": { "@yyfather/dsh-billing-dock": "link:E:/path/to/billing-dock" },
"dsh": { "profile": { "bundles": ["...", "@yyfather/dsh-billing-dock"] } }
```

宿主侧改动需重启 DSH；客户端改动刷新页面即可。

## 许可

MIT。解析器部分来自 @sky_wing_dn/dsh-fairy-zzz（MIT，原作者 AssassinVIX / SkyWingDN）。

## 排查

- 浮层不出现：确认宿主已重启、`bundles` 里有本包、`GET /billing/usage` 不是 404
- 今日电费一直为 0：确认 `DSH_HOME/sessions` 有当天日志；`?diag=1` 看 `zstd` 是否为 true
