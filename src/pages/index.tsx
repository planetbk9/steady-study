import * as React from "react";
import { Link } from "gatsby";
import HeaderMenu from "../components/HeaderMenu/HeaderMenu";
import { withLayout, LayoutProps, menuItems } from "../components/Layout";
import { mainColor } from "../constant/colors";
import {
  Button,
  Segment,
  Container,
  Grid,
  Header,
  Icon
} from "semantic-ui-react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { pulse } from "react-animations";

const contentEnum = {
  first: "home__first",
  second: "home__second"
};

const pulseAnimation = keyframes`${pulse}`;
const BouncyText = styled.h1`
  animation: 1s ${pulseAnimation} infinite;
  font-size: 50px;
`;

const MainWrapper = styled.div`
  margin-top: 200px;
`;

const SubWrapper = styled.div`
  padding: 12px;
  text-align: center;
`;

const bottomContent = [
  {
    buttonContent: "go to page",
    icon: "book",
    text: "See how i think and study"
  },
  {
    buttonContent: "go to page",
    icon: "search",
    text: " See who am i"
  },
  {
    buttonContent: "contact",
    icon: "phone",
    text: " Contact me"
  }
];

const Globals = createGlobalStyle`
  body,h1,h2,h3,h4,h5,p,div {
    @font-face { 
    font-family: 'Godo'; 
    font-style: normal; 
    font-weight: 400; 
    src: url('//cdn.jsdelivr.net/korean-webfonts/1/corps/godo/Godo/GodoM.woff2') format('woff2'), url('//cdn.jsdelivr.net/korean-webfonts/1/corps/godo/Godo/GodoM.woff') format('woff'); } 
    @font-face { font-family: 'Godo'; font-style: normal; font-weight: 700; src: url('//cdn.jsdelivr.net/korean-webfonts/1/corps/godo/Godo/GodoB.woff2') format('woff2'), url('//cdn.jsdelivr.net/korean-webfonts/1/corps/godo/Godo/GodoB.woff') format('woff'); } .godo * { font-family: 'Godo', sans-serif; }
    font-family: "Godo" !important;
  }
`;

interface Props {
  location: { pathname: string };
}

interface State {}

class IndexPage extends React.Component<Props, State> {
  intersectionObserver: {
    observe: (arg0: any) => void;
    disconnect: () => void;
  } = null;

  contents = {
    [contentEnum.first]: {
      id: contentEnum.first,
      intersectionRatio: 0,
      label: "메인",
      ref: React.createRef()
    },
    [contentEnum.second]: {
      id: contentEnum.second,
      intersectionRatio: 0,
      label: "메인2",
      ref: React.createRef()
    }
  };

  componentDidMount() {
    this.attachIntersectionObserver();
  }

  componentWillUnmount() {
    this.detachIntersectionObserver();
  }

  attachIntersectionObserver = () => {
    if (this.intersectionObserver) {
      return;
    }

    const threshold = new Array(11).fill(0).map((_, index) => index * 0.01);

    this.intersectionObserver = new window.IntersectionObserver(
      this.handleIntersectionChange,
      { threshold }
    );
    console.log(this.contents[contentEnum.first]);
    Object.values(this.contents).forEach(tab => {
      this.intersectionObserver.observe(tab.ref.current);
    });
  };

  detachIntersectionObserver() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  handleIntersectionChange = (entries: any) => {
    console.log(entries);
  };

  render() {
    const { location } = this.props;

    return (
      <div>
        <Globals />
        {/* Master head */}
        <Segment
          vertical
          inverted
          textAlign="center"
          className="masthead"
          style={{ background: `${mainColor}` }}
        >
          <HeaderMenu
            Link={Link}
            pathname={location.pathname}
            items={menuItems}
            inverted
          />
          <MainWrapper>
            <Container text>
              <Icon name="book" size="huge" />
              <BouncyText>Steady Study</BouncyText>
              <article>
                <div className="blue" />
                <div className="green" />
              </article>
              <Header inverted as="h2">
                I am Ideveloper
              </Header>
              <Header inverted as="h3">
                :) Idea + Developer
              </Header>
              <Button primary size="huge" style={{ marginTop: "50px" }}>
                Welcome to my blog
              </Button>
            </Container>
          </MainWrapper>
        </Segment>
        <div id={contentEnum.first} ref={this.contents[contentEnum.first].ref}>
          <div>
            <Grid stackable verticalAlign="middle" className="container">
              <Grid.Row>
                <Grid.Column>
                  <SubWrapper>
                    <Header>Hi I'm Ideveloper</Header>
                    <p>I have no fear about learning new technology</p>
                    <p>I am good at dealing with error situation</p>
                  </SubWrapper>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </div>
        {/* Key features */}
        <div
          id={contentEnum.second}
          ref={this.contents[contentEnum.second].ref}
        >
          <div>
            <Grid
              columns="3"
              textAlign="center"
              divided
              relaxed
              stackable
              className="container"
            >
              <Grid.Row>
                {bottomContent.map(content => {
                  return (
                    <Grid.Column
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: " 200px",
                        justifyContent: "center"
                      }}
                    >
                      <Header icon>
                        <Icon name={content.icon} />
                        {content.text}
                      </Header>
                      <Button
                        primary
                        size="huge"
                        style={{ background: mainColor }}
                      >
                        {content.buttonContent}
                      </Button>
                    </Grid.Column>
                  );
                })}
              </Grid.Row>
            </Grid>
          </div>
        </div>
      </div>
    );
  }
}

export default withLayout(IndexPage);
