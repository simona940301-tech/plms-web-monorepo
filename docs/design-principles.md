docs/design-principles.md

🎯 使命與定位
終極使命：讓全台灣學生用遊戲化系統快樂學習，最高效率達成個人目標。
優先原則：學習者福祉 > 獲利。
紅線：
不做黑箱分數（Ready Score 計算邏輯公開透明）。
不做操縱型上癮設計。
不濫用或隱藏使用者資料。

🧭 設計原則（Web / Waiting List / Ready Score Lite）
1. UX 八原則
簡潔極致：兩色系（主色 + 灰階）、大留白、簡單導覽。
正向語氣：文案像學長姐鼓勵，不用威嚇或焦慮字眼。
可見進步：Ready Score 結果用曲線與分級顯示差距。
低焦慮：避免倒數壓迫，CTA 用「下一步建議」而非「你很糟」。
即時回饋：提交表單或完成測驗後立即顯示結果與鼓勵。
低摩擦 Flow：Waiting List 表單 ≤ 4 欄，RS Lite 直接進入。
一致性：同一色彩、按鈕設計、字體層級（H1=40px, H2=24px, Body=16px）。
透明度：Ready Score 僅作為診斷，不會影響學校或官方成績。

2. StoryBrand (SB7) Framework
角色：學生（焦慮、缺乏方向），家長（想看見進步）。
問題：學習沒有動力、補習花錢卻沒效果、家長看不懂進步。
指導者：台大團隊（有經驗、可信賴）。
計畫：
第一步：做 Ready Score 測驗
第二步：收到差距分析與建議
第三步：用 App 練習、持續進步
行動 CTA：立即加入候補名單 / 馬上測 Ready Score
避免失敗：別浪費時間在無效補習或刷題。
成功願景：看見自己曲線往上、家長也放心。

📝 Waiting List Flow
1. 表單內容
姓名 (name)
Email (email)
年級 (grade)
目標科系 (target_major, optional)
2. 使用者體驗
提交後顯示感謝頁：
「你已經加入候補名單！」
CTA：「馬上做 Ready Score Lite」
3. 後端資料結構
waiting_list {
  name: string,
  email: string,
  grade: string,
  target_major?: string,
  created_at: serverTimestamp
}
4. Email 自動化流程
#1 歡迎信：介紹團隊 & 感謝加入
#2 Ready Score 教學：如何解讀分數、下一步怎麼做
#3 提醒行動：下載 App、參加完整模考

📊 Ready Score Lite Flow (Web)
1. 測驗規格
題數：10 題（字彙 + 文法 + 閱讀各約 3–4 題）
題型：單選題（四選一）
顯示計時：總計 10 分鐘，但不強迫倒數
2. 流程
學生進入 /ready-score-lite
題目依序作答，提交答案
系統計算分數（0–100%）
顯示結果頁：
區間（如 RS 55–65）
差距解釋：「你在閱讀題表現最好，單字是弱點」
CTA：「登入 App 完成完整 Ready Score」
3. 資料寫入
rsAttempts {
  user_id: string,
  quiz_id: string,
  score: number,
  correct_count: number,
  source: "lite_web",
  created_at: serverTimestamp
}
4. 心理學設計
避免焦慮：不用「你很爛」，用「這裡是你最有進步空間的部分」。
給予方向：下一步建議 = 「App 完整 Ready Score」或「開始單字任務」。

🎨 UI 規範 (Web)
Hero 區塊：一句話標語 + CTA 按鈕
顏色：深藍/墨綠為主色，灰階背景，CTA 高亮色
字體層級：
Hero Title: 40px
Section Title: 24px
正文: 16px
註解: 12px
按鈕規則：底部固定一顆主 CTA，避免多選焦慮
狀態管理：所有頁面有 Empty / Loading / Error 三態

🛡️ 家長端價值溝通
家長主要在 Email / 月報中看到 Ready Score 差距曲線。
用語：支持型 → 「孩子在單字部分進步了，但閱讀還有空間」
目的：建立信任，避免焦慮比較。

👉 使用方式：
當要做 Landing Page / Waiting List / Ready Score Lite 的設計或前端開發，把這份文件當 prompt context。
遊戲化邏輯（能量、金幣、任務）不在此檔，請參考 game-design.md。

