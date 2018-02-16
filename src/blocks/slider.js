"use strict";

export default class Slider extends React.Component{
    constructor() {
        super();

        this.state = {
            value: .5
        }
    }

    render() {
        return <input type={"range"} value={this.state.value} step={.001} max={this.props.max} min={this.props.min} onChange={
            newValue => this.setState({
                value: newValue
            })
        }/>
    }
}