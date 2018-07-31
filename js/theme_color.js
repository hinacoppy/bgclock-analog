// Backgammon Clock and Score board App 用 theme_color.js
function set_themecolor(theme) {
  let themecolor = {};
  switch (theme) {
  case "warm":
    themecolor.back_pause   = "#843";
    themecolor.back_teban   = "#fff";
    themecolor.back_noteban = "#433";
    themecolor.back_alert   = "#f00";
    themecolor.clock_border = "#302";
    themecolor.dots_min     = "#bee";
    themecolor.dots_hour    = "#bcc";
    themecolor.hour_hand    = "#b22";
    themecolor.min_hand     = "#000";
    themecolor.sec_hand     = "#e63";
    themecolor.center_fill  = "#e60";
    themecolor.center_stroke= "#e63";
    themecolor.delay_remain = "#a24";
    themecolor.delay_used   = "#fe8";
    themecolor.delay_border = "#e5p";
    break;
  case "cool":
    themecolor.back_pause   = "#89b";
    themecolor.back_teban   = "#fff";
    themecolor.back_noteban = "#789";
    themecolor.back_alert   = "#f00";
    themecolor.clock_border = "#007";
    themecolor.dots_min     = "#666";
    themecolor.dots_hour    = "#699";
    themecolor.hour_hand    = "#148";
    themecolor.min_hand     = "#000";
    themecolor.sec_hand     = "#3b8";
    themecolor.center_fill  = "#376";
    themecolor.center_stroke= "#3b8";
    themecolor.delay_remain = "#2ae";
    themecolor.delay_used   = "#def";
    themecolor.delay_border = "#14c";
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
    themecolor.center_fill  = "#222";
    themecolor.center_stroke= "#222";
    themecolor.delay_remain = "#777";
    themecolor.delay_used   = "#fff";
    themecolor.delay_border = "#888";
    break;
  }
  return themecolor;
}
