import * as React from "react";

import classNames from "classnames";

import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

import { Button } from "@material-ui/core";

import pink from "@material-ui/core/colors/pink";
import teal from "@material-ui/core/colors/teal";

const styles = (theme: Theme) =>
  createStyles({
    button: { boxShadow: "none", color: "#fff" },
    clear: {
      "&, &:hover": {
        backgroundColor: pink[700]
      },
      fontWeight: "bold"
    },
    column: { gridColumnEnd: "span 1", textAlign: "center" },
    enter: {
      "&, &:hover": {
        backgroundColor: teal[700]
      },
      fontWeight: "bold"
    },
    normal: {
      "&, &:hover": {
        backgroundColor: pink[400]
      }
    }
  });

interface IKeyProps extends WithStyles<typeof styles> {
  label: string;
  className?: string;
  onClick: (value: string) => void;
  type: "normal" | "clear" | "enter";
}

const Key = withStyles(styles)((props: IKeyProps) => {
  const { className, classes, label, type } = props;

  const handleClick = () => {
    props.onClick(label);
  };

  return (
    <div className={classNames(classes.column, className)}>
      <Button
        onClick={handleClick}
        variant="fab"
        className={classNames(classes.button, classes[type])}
      >
        {label}
      </Button>
    </div>
  );
});

export { Key };
