import * as React from "react";

import { Button } from "@material-ui/core";

import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";

import { Theme } from "@material-ui/core/styles/createMuiTheme";

import blue from "@material-ui/core/colors/blue";
import pink from "@material-ui/core/colors/pink";

/**
 * CSSを定義する
 *
 * @param theme Material-UIベーステーマ
 */
const styles = (theme: Theme) =>
  createStyles({
    clear: {
      backgroundColor: pink[500],
      fontWeight: "bold"
    },
    column: { gridColumnEnd: "span 1", textAlign: "center" },
    enter: {
      backgroundColor: blue[500],
      fontWeight: "bold"
    },
    root: {
      display: "grid",
      gridGap: `${theme.spacing.unit * 3}px`,
      gridTemplateColumns: "repeat(3, 1fr)"
    }
  });

interface IKeyboardProps extends WithStyles<typeof styles> {
  onChange: (value: string) => void;
}

const Keyboard = withStyles(styles)((props: IKeyboardProps) => {
  const handleClick = (label: string) => () => {
    props.onChange(label);
  };

  const { classes } = props;
  const labels = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "AC", "0", "="];

  return (
    <div className={classes.root}>
      {labels.map(label => (
        <div className={classes.column} key={`col${label}`}>
          <Button
            color="secondary"
            onClick={handleClick(label)}
            variant="fab"
            className={`${label === "AC" ? classes.clear : ""} ${
              label === "=" ? classes.enter : ""
            }`}
          >
            {label}
          </Button>
        </div>
      ))}
    </div>
  );
});

export { Keyboard };
