export default {
  color: {
    main: "#76B55B",
    mainText: "#222222",
    mainButton: "#DDA66A", // 少しくすんだオレンジ
    secondary1: "#7A9D79", // くすんだ緑
    secondary2: "#9FCB8C", // 若干くすんだ少し薄い緑
    secondary3: "#f1f4ef", // とても薄い緑
    secondaryText1: "#444444",
    secondaryText2: "#2F2F2F",
    secondaryButton1: "#DE577C", // ビビットなピンク
    secondaryButton2: "#DDDA69", // 少しくすんだ黄色
    disabled: "#E6E6E6",
    footerBackground: "#F7F7F7",
    red: "#F45B46",
    yellow: "#F4E546",
    orange: "#F4A446",
    blue: "#60C2D0",
    facebook: "#3B579D",
    google: "#DC4E40",
    twitter: "#00ACED",
    github: "#333",
    LinkedIn: "#0071A1"
  },
  radius: {
    base: "5px"
  },
  fontFamily: {
    default:
      "'PT Sans', 'Hiragino Kaku Gothic pro', 'ヒラギノ角ゴW3', 'Meiryo', 'MS Pゴシック', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif', 'Segoe UI'",
    monospace:
      "'Menlo', 'Myriad Pro', Myriad, Consolas, 'Courier New', Courier, Monaco, monospace"
  },
  shadow: {
    default: "0 0 6px 0 rgba(203, 203, 203, .5)"
  }
};

export function defaultHover() {
  return `
    &:hover {
      opacity: .66;
      transition: all .15s linear;
      cursor: pointer;
    }
  `;
}
