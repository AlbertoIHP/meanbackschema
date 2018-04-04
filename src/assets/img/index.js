import React from 'react';
import { withApollo, gql, graphql, compose } from 'react-apollo';
import {
  Row,
  Col,
  Container,
  Table,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
} from 'reactstrap';
import { withRouter } from 'react-router-dom';
import AppLoading from '../../components/AppLoading';
import './styles.css';
import SpecificMap from './components/SpecificMap';
import Utils from './../../utils';

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkerShown: false,
    }
    this.delayedShowMarker = this.delayedShowMarker.bind(this);
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
  }

  componentDidMount(){
    this.delayedShowMarker();
  }

  delayedShowMarker(){
    setTimeout(function() { this.setState({ isMarkerShown: true}); }.bind(this), 3000);
  }

  handleMarkerClick() {
    this.setState({ isMarkerShown: false });
    alert('hola');
    this.delayedShowMarker();
  }


  onClickChannelHandle(channel) {
  }

  render() {

    const { data } = this.props;
    if (data.loading) {
      return <AppLoading/>;
    } else if (data.error) {
      return (<p>Error: {data.error}!</p>);
    }
    let brand = this.props.data.viewer.brand;
    let locals = brand.graph.data;
    let locals_comparison = brand.old_graph.data;
    console.dir(locals_comparison);
    console.log(locals);
    return (
      <Container fluid>
        <Row>
          <Col xs={9} className="px-0 map">
            <SpecificMap isMarkerShown
              markers={locals}
              onMarkerClick={this.handleMarkerClick}
            />
          </Col>
          <Col xs={3} className="px-0 listMap">
            <ListGroup>
              {locals.map((marker, index) => {
              return (
                <ListGroupItem key={index}>
                  <ListGroupItemHeading>{marker.local_name}</ListGroupItemHeading>
                  <ListGroupItemText>
                    Ventas: {Utils.toMoneyFormat(marker.revenue)}

                  </ListGroupItemText>
                </ListGroupItem>)
              })}
            </ListGroup>
          </Col>
        </Row>
        <Row>

        </Row>
      </Container>
    );
  }
}



export default compose(
  withApollo,
  withRouter,
  graphql(gql`
  {
    viewer {
      id,
      brand(brand_id: 1){
        id,
        graph(type: BEST_LOCALS) {
          id,
          type,
          data
      	}
        old_graph: graph(type: BEST_LOCALS,) {
          id,
          type,
          data
        }
    	}
  	}
  }
`))(Map);
