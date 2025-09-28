GTM setup (promo.xuerenjing.com)

1) GA4 Configuration
- Tag: GA4 Configuration
- Measurement ID: G-K27QY8TECD
- Trigger: All Pages

2) SPA page_view (HashRouter)
- Trigger: History Change (built-in)
- Tag: GA4 Event, Event Name: page_view
- Trigger: History Change

3) Data Layer Variables
- utm_source → Data Layer Variable Name: utm.utm_source
- utm_medium → utm.utm_medium
- utm_campaign → utm.utm_campaign
- utm_content → utm.utm_content
- variant → variant
- score → score (for rs_complete)
- correct_count → correct_count (for rs_complete)

4) Custom Events
Create GA4 Event tag for each (Trigger: Custom Event with same name):
- lp_view
- cta_click
- rs_start
- rs_complete (add params: score, correct_count)
- core_loop_complete

5) Pixels (optional, via GTM templates)
- Meta Pixel: PageView (All Pages), Lead (waitlist success), CompleteRegistration (rs_complete)
- TikTok Pixel: 同上

6) Consent
- 你站點已使用同意後才載入 GTM；如需 Consent Mode v2，可在 GTM Admin 開啟並依需調整。

