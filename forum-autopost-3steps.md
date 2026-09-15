# 浏览器自动化 · 页面内接口重放通用三步法

> 换任何网站都能套用的自动化方法论。本文是通用版；完整实战教程（含可运行源码、参数表、十六轮踩坑归因）见文末。

## 背景

网页界面难自动化是常态：前端框架的「状态墙」让填表工具读到的永远是空值，网页入口与后端接口的参数约定常有出入。绕开界面、直接在页面内重放接口请求，是更稳的通道。

## 三步法

### 第 1 步 · 找凭证

登录目标站 → F12 开发者工具 → 应用（Application）→ 本地存储（Local Storage）→ 找「三段式」令牌（三段用点隔开的长串，即 JWT）。

技巧：不写死键名，扫描整个 localStorage——先找三段式裸令牌，再找包在 JSON 里的（依次试 `token` / `access_token` / `jwt` 字段）。网站改键名也不怕。

### 第 2 步 · 找接口

F12 → 网络（Network）面板 → 手动正常操作一次 → 看请求打到了哪个地址、请求体长什么样。

**照抄参数，一个都别自己猜。** 最大的教训：抓包应该排第 1 轮，而不是第 14 轮。

### 第 3 步 · 重放

在目标站自己的页面里执行 fetch 重放（控制台粘贴，或自动化工具的 evaluate 注入）：

- 令牌放请求头：`Authorization: Bearer <令牌>`
- 凭证模式带 `include`
- 中文内容别直接嵌进注入代码（引号+换行嵌进去必炸）——转 base64 中转，页面内再解码

```javascript
// 页面内重放骨架（通用版）
const payload = JSON.parse(decodeURIComponent(escape(atob("__B64__"))));
const headers = { "Content-Type": "application/json" };
if (token) headers["Authorization"] = "Bearer " + token;
const res = await fetch("/api/v1/xxx", {
  method: "POST",
  headers: headers,
  credentials: "include",
  body: JSON.stringify(payload),
});
```

## 两个避坑

1. **命令行拼接是转义地狱**：参数数组直调工具（spawnSync 数组模式），不走字符串拼接。
2. **幸存者偏差**：别拿「站内搜不到同类求助」当「没人撞过墙」的证据——撞坑的人恰恰发不出声。搜不到 ≠ 没发生。

## 方法论一句话

自动化攻坚三步定序：① 抓包看正常请求 → ② 查现成解（站内同类问题 + 开源文档 + 自家调研笔记）→ ③ 才自己试。盲试超过 3 轮 = 打法错了，停下来先抓包。

---

## 完整实战教程

上述方法的完整实战版（十六轮真实攻坚沉淀：完整可运行源码逐段讲解、关键参数表、发帖前检查清单、踩坑归因全表），已上架 [UUMit 知识商店](https://m.uumit.com/share/digital-assets/ea458221-8191-4af2-b62c-4f99db696c23)，购买锁定后续更新（进阶篇：定时排期、自动巡检、多板块批量）。

## 同系列

- [uumit-seller-playbook](../uumit-seller-playbook)：卖家检查清单与踩坑实录
- [tts-quality-toolbox](../tts-quality-toolbox)：中文 TTS 质量评测工具箱
- [agent-skills](../agent-skills)：三个实战 Agent Skills
