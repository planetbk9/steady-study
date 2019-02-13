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
  Icon,
} from "semantic-ui-react";
import styled, { keyframes } from "styled-components";
import { pulse } from "react-animations";

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
`;

const IndexPage = (props: LayoutProps) => (
  <div>
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
        pathname={props.location.pathname}
        items={menuItems}
        inverted
      />
      <MainWrapper>
        <Container text>
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
          <Button primary size="huge">
            Welcome to my blog
          </Button>
        </Container>
      </MainWrapper>
    </Segment>

    {/* About this starter */}
    <Segment vertical className="stripe">
      <Grid stackable verticalAlign="middle" className="container">
        <Grid.Row>
          <Grid.Column width="24">
            <Header>I am Front-End Developer</Header>
            <SubWrapper>
              <p>I have no fear about learning new technology</p>
              <p>I am good at dealing with error situation</p>
            </SubWrapper>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    {/* Key features */}
    <Segment vertical className="stripe alternate feature">
      <Grid
        columns="3"
        textAlign="center"
        divided
        relaxed
        stackable
        className="container"
      >
        <Grid.Row>
          <Grid.Column>
            <Header icon>
              <Icon name="wizard" />A kind of magic!
            </Header>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas
              eaque at quae cupiditate aspernatur quibusdam! Distinctio quod
              non, harum dolorum earum molestias, beatae expedita aliquam
              dolorem asperiores nemo amet quaerat.
            </p>
          </Grid.Column>
          <Grid.Column>
            <Header icon>
              <Icon name="wizard" />A kind of magic!
            </Header>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas
              eaque at quae cupiditate aspernatur quibusdam! Distinctio quod
              non, harum dolorum earum molestias, beatae expedita aliquam
              dolorem asperiores nemo amet quaerat.
            </p>
          </Grid.Column>
          <Grid.Column>
            <Header icon>
              <Icon name="wizard" />A kind of magic!
            </Header>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas
              eaque at quae cupiditate aspernatur quibusdam! Distinctio quod
              non, harum dolorum earum molestias, beatae expedita aliquam
              dolorem asperiores nemo amet quaerat.
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  </div>
);

export default withLayout(IndexPage);
