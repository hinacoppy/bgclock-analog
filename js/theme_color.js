// Backgammon Clock and Score board App 用 theme_color.js
function set_themecolor(theme) {
  let themecolor = {};
  switch (theme) {
  case "warm":
    themecolor.back_pause   = "#a73";
    themecolor.back_teban   = "#fff";
    themecolor.back_noteban = "#865";
    themecolor.back_alert   = "#f00";
    themecolor.clock_border = "#302";
    themecolor.dots_min     = "#bbe";
    themecolor.dots_hour    = "#bcc";
    themecolor.hour_hand    = "#722";
    themecolor.min_hand     = "#000";
    themecolor.sec_hand     = "#943";
    themecolor.center_fill  = "#e60";
    themecolor.center_stroke= "#e63";
    themecolor.delay_remain = "#a24";
    themecolor.delay_used   = "#fee";
    themecolor.delay_border = "#e54";
    break;
  case "cool":
    themecolor.back_pause   = "#9ac";
    themecolor.back_teban   = "#fff";
    themecolor.back_noteban = "#789";
    themecolor.back_alert   = "#f00";
    themecolor.clock_border = "#007";
    themecolor.dots_min     = "#333";
    themecolor.dots_hour    = "#388";
    themecolor.hour_hand    = "#148";
    themecolor.min_hand     = "#000";
    themecolor.sec_hand     = "#26b";
    themecolor.center_fill  = "#376";
    themecolor.center_stroke= "#26b";
    themecolor.delay_remain = "#28e";
    themecolor.delay_used   = "#eef";
    themecolor.delay_border = "#25c";
    break;
  case "mono":
    themecolor.back_pause   = "#999";
    themecolor.back_teban   = "#fff";
    themecolor.back_noteban = "#666";
    themecolor.back_alert   = "#f00";
    themecolor.clock_border = "#000";
    themecolor.dots_min     = "#333";
    themecolor.dots_hour    = "#111";
    themecolor.hour_hand    = "#222";
    themecolor.min_hand     = "#000";
    themecolor.sec_hand     = "#222";
    themecolor.center_fill  = "#555";
    themecolor.center_stroke= "#222";
    themecolor.delay_remain = "#777";
    themecolor.delay_used   = "#fff";
    themecolor.delay_border = "#555";
    break;
  }
  return themecolor;
}
