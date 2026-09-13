/**
 * 询价批量回复脚本（脱敏示例版）
 * 用法：node inquiry_reply.js <chat_id> [<chat_id>...]
 * 需自行配置 API 凭据读取逻辑（原版依赖平台套件 rest_request.js）。
 * 仅用于自动化客服回复，话术请按你的业务替换 generic 与 replies。
 */
// 批量回复询价会话：node inquiry_reply.js
const { execFileSync } = require("child_process");
const NODE = process.execPath;
const SCRIPT = "C:/Users/刘皇一二/.workbuddy/skills/uumit-agent/scripts/rest_request.js";
const chats = [
  ["774acf9a-6d8f-46ba-b3a4-0e5aed837a58", "您好！您的方案描述最完整（采集边界与数据诚实声明都写清楚了），欢迎在任务页提交正式申请，我们会尽快接受。验收标准：样本≥50 家、七项字段齐全、来源可核验、接受平台 AI 预审与一次返工。"],
  ["6fe297d2-", ""],
];
const replies = {
  "774acf9a": "您好！您的方案描述最完整（采集边界与数据诚实声明都写清楚了），欢迎在任务页提交正式申请，我们会尽快接受。验收标准：样本≥50 家、七项字段齐全、来源可核验、接受平台 AI 预审与一次返工。",
  "6e03b9ec": "您好！您对公开数据边界与不编造数据的原则说明得很清楚，与我们验收要求完全一致，欢迎在任务页提交正式申请，我们会优先考虑。验收标准：样本≥50 家、七项字段齐全、来源可核验、接受平台 AI 预审与一次返工。",
};
const generic = "感谢承接意向！相关任务的接单方已匹配完成。后续还会发布数据采集/内容类任务，欢迎关注店铺动态，届时欢迎申请合作。";
const ids = process.argv.slice(2);
for (const cid of ids) {
  let msg = generic;
  for (const [k, v] of Object.entries(replies)) {
    if (cid.startsWith(k) && v) { msg = v; break; }
  }
  try {
    const out = execFileSync(NODE, [SCRIPT, "POST", `/api/v1/inquiry/chats/${cid}/messages`, "--body", JSON.stringify({ content: msg }), "--confirmed"], { encoding: "utf8" });
    const j = JSON.parse(out);
    console.log(`${cid.slice(0, 8)} -> code ${j.code} ${j.message}`);
  } catch (e) {
    console.log(`${cid.slice(0, 8)} -> ERROR ${String(e.message).slice(0, 150)}`);
  }
}
