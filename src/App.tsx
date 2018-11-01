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

import green from "@material-ui/core/colors/green";
import pink from "@material-ui/core/colors/pink";

import { Theme } from "@material-ui/core/styles/createMuiTheme";

/**
 * 計算カードに使用する数の最小値
 */
const minNumber = 0;

/**
 * 計算カードに使用する数の最大値
 */
const maxNumber = 20;

/**
 * 待ち時間（ms）
 */
const timeout = 2000;

/**
 * 答えあわせトリガーのキーコード
 */
const keyCodes = [
  13, // return
  32 // space
];

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
  "⚖️ もんだいを作っています...",
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
    secondary: { main: green[300] }
  },
  typography: {
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
      fontSize: 100
    },
    field: {
      fontSize: 100,
      textAlign: "right",
      width: "1.5em"
    },
    message: {
      color: theme.palette.primary.contrastText,
      fontSize: 50,
      padding: theme.spacing.unit * 2,
      textAlign: "center"
    },
    paper: {
      marginBottom: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2
    },
    root: {
      backgroundColor: pink[300],
      boxSizing: "border-box",
      minHeight: "100vh",
      padding: theme.spacing.unit * 4
    },
    title: {
      color: theme.palette.primary.contrastText,
      fontSize: 50,
      fontWeight: "bold",
      marginBottom: theme.spacing.unit * 2,
      padding: theme.spacing.unit * 2,
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
    private numberInput: React.RefObject<HTMLInputElement>;

    constructor(props: IAppProps) {
      super(props);

      this.numberInput = React.createRef();

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

      if (this.numberInput.current) {
        this.numberInput.current.focus();
      }
    };

    public handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        inputAnswer: event.target.value
      });
    };

    /**
     * 答えあわせをする
     */
    public checkAnswer = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (keyCodes.indexOf(event.keyCode) === -1) {
        return;
      }

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
              <ruby>
                計<rp>(</rp>
                <rt>けい</rt>
                <rp>)</rp>算<rp>(</rp>
                <rt>さん</rt>
                <rp>)</rp>
              </ruby>
              {`カード #${cardNumber}`}
            </Typography>
            <Paper className={classes.paper}>
              <Grid
                alignItems="center"
                container={true}
                direction="row"
                justify="center"
                spacing={24}
              >
                <Grid item={true}>
                  {state === StateType.TURNING ? (
                    <CircularProgress color="secondary" size={100} />
                  ) : (
                    false
                  )}
                  <Typography className={classes.expr}>
                    {cardExpression}
                  </Typography>
                </Grid>
                <Grid item={true}>
                  <TextField
                    autoFocus={true}
                    disabled={state !== StateType.WAITING}
                    InputProps={{
                      classes: {
                        input: classes.field
                      },
                      inputProps: {
                        max: maxNumber * 2, // 入力できる最大値
                        min: minNumber
                      }
                    }}
                    inputRef={this.numberInput}
                    margin="normal"
                    onChange={this.handleChange}
                    onKeyDown={this.checkAnswer}
                    type="number"
                    value={inputAnswer}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>
            <Typography className={classes.message}>
              {messages[state]}
            </Typography>
          </div>
        </MuiThemeProvider>
      );
    }
  }
);

export default App;
