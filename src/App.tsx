import * as React from "react";

import {
  CircularProgress,
  Grid,
  Paper,
  TextField,
  Typography
} from "@material-ui/core";

import {
  createMuiTheme,
  createStyles,
  MuiThemeProvider,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";

import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";

import { Theme } from "@material-ui/core/styles/createMuiTheme";
import { Keyboard } from "./Keyboard";

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
    secondary: { main: blue[300], contrastText: "#fff" }
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
    expr: {
      fontSize: "2rem"
    },
    field: {
      textAlign: "right",
      width: "2em"
    },
    message: {
      color: theme.palette.primary.contrastText,
      fontWeight: "bold",
      marginBottom: theme.spacing.unit,
      padding: theme.spacing.unit,
      textAlign: "center"
    },
    paper: {
      marginBottom: theme.spacing.unit,
      padding: theme.spacing.unit
    },
    root: {
      backgroundColor: pink[300],
      boxSizing: "border-box",
      minHeight: "100vh",
      padding: theme.spacing.unit * 2
    },
    title: {
      color: theme.palette.primary.contrastText,
      fontWeight: "bold",
      marginBottom: theme.spacing.unit,
      padding: theme.spacing.unit,
      textAlign: "center"
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

    public hangleKeyboardChange = (label: string) => {
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
            <Typography className={classes.title}>
              {`計算カード #${cardNumber}`}
            </Typography>
            <Paper className={classes.paper}>
              <Grid
                alignItems="center"
                container={true}
                direction="row"
                justify="center"
                spacing={8}
              >
                <Grid item={true}>
                  {state === StateType.TURNING ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    false
                  )}
                  <Typography className={classes.expr}>
                    {cardExpression}
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <TextField
                    InputProps={{
                      classes: {
                        input: classes.field
                      },
                      readOnly: true
                    }}
                    value={inputAnswer}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>
            <Typography className={classes.message}>
              {messages[state]}
            </Typography>
            <Keyboard onChange={this.hangleKeyboardChange} />
          </div>
        </MuiThemeProvider>
      );
    }
  }
);

export default App;
