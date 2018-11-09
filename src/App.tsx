import * as React from "react";

import { Typography } from "@material-ui/core";

import {
  createMuiTheme,
  createStyles,
  MuiThemeProvider,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";

import pink from "@material-ui/core/colors/pink";
import teal from "@material-ui/core/colors/teal";

import { Theme } from "@material-ui/core/styles/createMuiTheme";

import { Key } from "./Key";

/**
 * 計算カードに使用する数の最小値
 */
const minNumber = 0;

/**
 * 計算カードに使用する数の最大値
 */
const maxNumber = 12;

/**
 * 待ち時間（ms）
 */
const timeout = 2000;

/**
 * 状況タイプ
 */
enum StateType {
  TURNING,
  WAITING,
  CHECK,
  INCORRECT,
  CORRECT
}

/**
 * メッセージ
 */
const messages = [
  "⚖️ もんだい作成中...",
  "🤔 こたえてね",
  "🖍 こたえあわせ中...",
  "まちがい ❌",
  "せいかい 🎉"
];

/**
 * Material-UIテーマを拡張する
 */
const exTheme = createMuiTheme({
  palette: {
    primary: { main: pink[300] },
    secondary: { main: teal[300], contrastText: "#fff" }
  },
  typography: {
    fontSize: 24,
    useNextVariants: true
  }
});

/**
 * CSSを定義する
 *
 * @param theme Material-UIベーステーマ
 */
const styles = (theme: Theme) =>
  createStyles({
    answer: {
      alignSelf: "center",
      color: theme.palette.primary.contrastText,
      fontSize: "3rem",
      gridColumn: "8 / span 2",
      letterSpacing: "-0.1rem",
      textAlign: "left"
    },
    expr: {
      alignSelf: "center",
      color: theme.palette.primary.contrastText,
      fontSize: "3rem",
      gridColumn: "2 / span 6",
      letterSpacing: "-0.1rem",
      textAlign: "right"
    },
    keyboard: {
      display: "grid",
      gridGap: `${theme.spacing.unit * 3}px`,
      gridTemplateColumns: "repeat(3, 1fr)",
      padding: `0 ${theme.spacing.unit * 2}px`
    },
    message: {
      color: "white",
      padding: theme.spacing.unit,
      textAlign: "center"
    },
    paper: {
      padding: theme.spacing.unit
    },
    root: {
      alignItems: "center",
      backgroundColor: pink[50],
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      overflow: "hidden"
    },
    stmt: {
      backgroundColor: pink[400],
      display: "grid",
      gridGap: `${theme.spacing.unit * 1.5}px`,
      gridTemplateColumns: "repeat(10, 1fr)",
      height: 80,
      width: "100%"
    },
    title: {
      color: "white",
      padding: theme.spacing.unit,
      textAlign: "center"
    },
    wrap: {
      backgroundColor: pink[200],
      borderRadius: 20,
      height: 520,
      maxWidth: 480,
      width: 300
    }
  });

/**
 * コンポーネントのProps
 * CSSのclassesを含めるためWithStylesを継承する
 */
interface IAppProps extends WithStyles<typeof styles> {}

/**
 * コンポーネントのState
 */
interface IAppState {
  // 答え
  cardAnswer: number;
  // 式
  cardExpression: string;
  // 現在のカードの枚数
  cardNumber: number;
  // 回答
  inputAnswer: string;
  // 状況
  state: StateType;
}

/**
 * ランダムな整数を生成する
 *
 * @param min 最小値
 * @param max 最大値
 */
const genNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max + 1)) + min;
};

/**
 * Reactコンポーネント
 */
const App = withStyles(styles)(
  class extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
      super(props);

      this.state = {
        cardAnswer: 0,
        cardExpression: "",
        cardNumber: 0,
        inputAnswer: "",
        state: StateType.TURNING
      };
    }

    public componentDidMount() {
      this.turnCard();
    }

    /**
     * 新しいカードにする
     */
    public turnCard = () => {
      this.setState({
        cardExpression: "",
        inputAnswer: "",
        state: StateType.TURNING
      });

      window.setTimeout(() => this.genExpression(), timeout);
    };

    /**
     * 問題をつくる
     */
    public genExpression = () => {
      const numbers = [
        genNumber(minNumber, maxNumber),
        genNumber(minNumber, maxNumber)
      ].sort((a, b) => b - a);

      const operator = genNumber(0, 1) === 1 ? "+" : "-";

      const answer = {
        "+": numbers[0] + numbers[1],
        "-": numbers[0] - numbers[1]
      }[operator];

      this.setState({
        cardAnswer: answer,
        cardExpression: `${numbers[0]} ${operator} ${numbers[1]} =`,
        cardNumber: this.state.cardNumber + 1,
        state: StateType.WAITING
      });
    };

    public handleClick = (label: string) => {
      const answer = this.state.inputAnswer;

      if (label === "=") {
        this.checkAnswer();
      } else if (label === "AC") {
        this.setState({
          inputAnswer: ""
        });
      } else if (label === "0" && answer === "") {
        // 何もしない
      } else {
        this.setState({
          inputAnswer: answer + label
        });
      }
    };

    /**
     * 答えあわせをする
     */
    public checkAnswer = () => {
      this.setState({
        state: StateType.CHECK
      });

      window.setTimeout(() => this.showResult(), timeout);
    };

    /**
     * 結果を表示する
     */
    public showResult = () => {
      const { cardAnswer, inputAnswer } = this.state;
      const isCorrect = cardAnswer === Number(inputAnswer);

      this.setState({
        state: isCorrect ? StateType.CORRECT : StateType.INCORRECT
      });

      window.setTimeout(() => {
        if (isCorrect) {
          // せいかい
          this.turnCard();
        } else {
          // まちがい
          this.setState({
            inputAnswer: "",
            state: StateType.WAITING
          });
        }
      }, timeout);
    };

    public render() {
      const { classes } = this.props;

      const { cardExpression, cardNumber, inputAnswer, state } = this.state;

      return (
        <MuiThemeProvider theme={exTheme}>
          <div className={classes.root}>
            <div className={classes.wrap}>
              <Typography className={classes.title}>
                {`計算カード #${cardNumber}`}
              </Typography>
              <div className={classes.stmt}>
                <Typography className={classes.expr}>
                  {cardExpression}
                </Typography>
                <Typography className={classes.answer}>
                  {inputAnswer}
                </Typography>
              </div>
              <Typography className={classes.message}>
                {messages[state]}
              </Typography>
              <div className={classes.keyboard}>
                <Key label="7" onClick={this.handleClick} type="normal" />
                <Key label="8" onClick={this.handleClick} type="normal" />
                <Key label="9" onClick={this.handleClick} type="normal" />
                <Key label="4" onClick={this.handleClick} type="normal" />
                <Key label="5" onClick={this.handleClick} type="normal" />
                <Key label="6" onClick={this.handleClick} type="normal" />
                <Key label="1" onClick={this.handleClick} type="normal" />
                <Key label="2" onClick={this.handleClick} type="normal" />
                <Key label="3" onClick={this.handleClick} type="normal" />
                <Key label="AC" onClick={this.handleClick} type="clear" />
                <Key label="0" onClick={this.handleClick} type="normal" />
                <Key label="=" onClick={this.handleClick} type="enter" />
              </div>
            </div>
          </div>
        </MuiThemeProvider>
      );
    }
  }
);

export default App;
