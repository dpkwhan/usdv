// Import React
import React from "react";

// Import Spectacle Core tags
import { Deck, Slide, Text } from "spectacle";
import MarketShareByYearExchWithData from "./MarketShareByYearExchWithData";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Require CSS
require("normalize.css");

const theme = createTheme(
  {
    primary: "white",
    secondary: "black",
    tertiary: "blue",
    quaternary: "black"
  },
  {
    primary: "Montserrat",
    secondary: "Helvetica"
  }
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck
        transition={["fade"]}
        theme={theme}
        transitionDuration={500}
        contentWidth={"95%"}
        contentHeight={"100%"}
        progress={"none"}
      >
        <Slide transition={["fade"]} bgColor="primary">
          <Text
            textSize="1.5em"
            margin="0px 0px 30px 0px"
            bold
            textColor="black"
          >
            U.S. Equities Daily Volume
          </Text>
          <MarketShareByYearExchWithData />
        </Slide>
      </Deck>
    );
  }
}
