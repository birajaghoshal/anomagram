import React, { Component } from "react";
// import { Button } from "carbon-components-react"
import { LeaderLine, animOptions } from "../helperfunctions/HelperFunctions"
import { Add16, Subtract16 } from '@carbon/icons-react';
import "./composemodel.css"
import * as _ from "lodash"

class ComposeModel extends Component {
    constructor(props) {
        super(props)

        this.state = {
            encoderDims: [8, 7, 6, 5, 4],
            decoderDims: [7, 15],
            latentDim: [2],
            maxLayers: 6,
            minLayers: 2,
            maxUnits: 8,
            minUnits: 2,
            defaultLayerDim: 3
        }

        this.lineHolder = { encoder: [], decoder: [] }

        this.rightTopAnchor = { x: "100%", y: "5%" }
        this.rightBottomAnchor = { x: "100%", y: "95%" }
        this.leftTopAnchor = { x: 0, y: "5%" }
        this.leftBottomAnchor = { x: "0%", y: "95%" }
    }
    componentDidMount() {
        this.drawAllLines();
    }

    getElement(network, attributeName, attributeValue) {
        return document.querySelector("div." + network).querySelector("[" + attributeName + "=" + attributeValue + "]")
    }

    drawAllLines() {


        for (const layer in this.state.encoderDims) {
            if ((layer * 1) !== (this.state.encoderDims.length - 1)) {
                let startEl = this.getElement("encoder", "layerdiv", "layerdiv" + layer)
                let endEl = this.getElement("encoder", "layerdiv", "layerdiv" + (layer * 1 + 1))
                // console.log(startEl, endEl);
                this.drawLeaderLine(startEl, endEl, this.rightTopAnchor, this.leftTopAnchor, "straight")
                this.drawLeaderLine(startEl, endEl, this.rightTopAnchor, this.leftBottomAnchor, "straight")
                this.drawLeaderLine(startEl, endEl, this.rightBottomAnchor, this.leftTopAnchor, "straight")
                this.drawLeaderLine(startEl, endEl, this.rightBottomAnchor, this.leftBottomAnchor, "straight")
            }
        }


    }

    drawLeaderLine(startElement, endElement, startAnchor, endAnchor, pathType) {
        let self = this
        let blueColor = "grey"
        let lineWidth = 1.5
        let plugType = "square"

        let line = new LeaderLine(
            LeaderLine.pointAnchor(startElement, startAnchor),
            LeaderLine.pointAnchor(endElement, endAnchor), {
            color: blueColor,
            startPlug: plugType,
            endPlug: plugType,
            startPlugColor: blueColor,
            path: pathType,
            size: lineWidth,
            startSocketGravity: -150,
            // hide: true,
            dash: { gap: 2 },

            // endPlugSize: 2,

        });
        // document.querySelector('.leader-line').style.zIndex = -100
        animOptions.duration = 800
        // line.show("draw", animOptions)
        // self.lineHolder.push({ line: line, index: 0 })
    }

    addEncoderLayerClick(e) {

        if (this.state.encoderDims.length + 1 <= this.state.maxLayers) {
            let currentDims = this.state.encoderDims
            currentDims.push(this.state.defaultLayerDim)
            this.setState({ encoderDims: currentDims })
        }

    }


    removeEncoderLayerClick(e) {

        if (this.state.encoderDims.length - 1 >= this.state.minLayers) {
            let currentDims = this.state.encoderDims
            currentDims.pop()
            this.setState({ encoderDims: currentDims })
        }


        // }

    }

    setStateVal(varGroup, newDims) {


        if (varGroup + "" === "encoder") {
            this.setState({ encoderDims: newDims })
        } else {
            this.setState({ decoderDims: newDims })
        }
    }

    getDims(dimType) {
        switch (dimType) {
            case "encoder":
                return this.state.encoderDims
            case "decoder":
                return this.state.decoderDims
            case "latent":
                return this.state.latentDim
            default:
                break
        }
    }




    updateLayerClick(e) {

        let currentDims = this.getDims(e.target.getAttribute("layergroup"));

        if (e.target.getAttribute("buttonaction") === "add") {

            if (currentDims.length + 1 <= this.state.maxLayers) {
                currentDims.push(this.state.defaultLayerDim)
                this.setStateVal(e.target.getAttribute("layergroup"), currentDims)
            }

        } else {

            if (currentDims.length - 1 >= this.state.minLayers) {
                currentDims.pop()
                this.setStateVal(e.target.getAttribute("layergroup"), currentDims)
            }
        }
    }

    updateUnits(e) {

        let currentDims = this.getDims(e.target.getAttribute("layergroup"));
        let currentUnit = currentDims[e.target.getAttribute("unitindex") * 1]
        // console.log(e.target.getAttribute("unitindex"), currentUnit);
        if (e.target.getAttribute("buttonaction") === "add") {

            if (currentUnit + 1 <= this.state.maxUnits) {
                currentDims[e.target.getAttribute("unitindex") * 1] = currentUnit + 1
                this.setStateVal(e.target.getAttribute("layergroup"), currentDims)
            }

        } else {

            if (currentUnit - 1 >= this.state.minUnits) {
                currentDims[e.target.getAttribute("unitindex") * 1] = currentUnit - 1
                this.setStateVal(e.target.getAttribute("layergroup"), currentDims)
            }

        }
    }

    nodeHover(e) {
        console.log(e.target.getAttribute("nodeunit"));

    }


    render() {

        let latentLayers = this.state.latentDim.map((data, index) => {
            let eachLayer = _.range(data).map((data, index) => {
                return (
                    <div className="eachunitbox " key={"eachlayer" + index}>
                        {/* {index} */}
                    </div>
                )
            })
            return (
                <div key={"latentlayer" + index} className=" h100 flex flexfull flexjustifycenter ">
                    <div className="  ">
                        <div className="" >
                            <div className="smalldesc mb3">{data} units</div>
                            <div
                                layergroup="latent"
                                unitindex={index}
                                buttonaction="add"
                                onClick={this.updateUnits.bind(this)}
                                className="updatebutton unselectable mb3 clickable">
                                <Add16 className="unclickable"></Add16>
                            </div>
                            <div className="layerdiv  pt3 mb3">{eachLayer}</div>
                            <div
                                layergroup="latent"
                                unitindex={index}
                                buttonaction="subtract"
                                onClick={this.updateUnits.bind(this)}
                                className="updatebutton unselectable  clickable">
                                <Subtract16 className="unclickable"></Subtract16>
                            </div>
                        </div>
                    </div>

                </div>
            )
        })

        let encLayers = this.state.encoderDims.map((data, layerindex) => {

            let eachLayer = _.range(data).map((unitindex) => {
                // console.log("layerunit" + layerindex + unitindex)
                return (
                    <div nodeunit={"layerunit" + layerindex + unitindex} ref={"layerunit" + layerindex + unitindex} className="eachunitbox " key={"eachunit" + unitindex}>
                        {/* {index} */}
                    </div>
                )
            })
            return (
                <div key={"enclayer" + layerindex} className="iblock  mr10 flex flexfull flexjustifycenter ">
                    <div className="iblock  ">
                        <div>
                            <div className="smalldesc mb3">{data} units</div>
                            <div
                                layergroup="encoder"
                                unitindex={layerindex}
                                buttonaction="add"
                                onClick={this.updateUnits.bind(this)}
                                className="updatebutton unselectable mb3 clickable">
                                <Add16 className="unclickable"></Add16>
                            </div>
                            <div layerdiv={"layerdiv" + layerindex} className="layerdiv  pt3 mb3">{eachLayer}</div>
                            <div
                                layergroup="encoder"
                                unitindex={layerindex}
                                buttonaction="subtract"
                                onClick={this.updateUnits.bind(this)}
                                className="updatebutton unselectable  clickable">
                                <Subtract16 className="unclickable"></Subtract16>
                            </div>

                        </div>
                    </div>
                </div>
            )
        })

        // console.log(encLayers.length);
        let decLayers = _.reverse(_.clone(encLayers));

        return (
            <div className="mb10">
                <div className="smalldesc mb5"> * we map the same configuration for both encoder and decoder </div>
                {/* Layer controls */}
                <div className="flex flexjustifycenter">
                    <div className="buttonbar mb5 iblock">
                        <div
                            layergroup="encoder"
                            buttonaction="add"
                            onClick={this.updateLayerClick.bind(this)}
                            className="updatebutton unselectable mr5 clickable">
                            <Add16 className="unclickable"></Add16>
                        </div>
                        <div
                            layergroup="encoder"
                            buttonaction="subtract"
                            onClick={this.updateLayerClick.bind(this)}
                            className="updatebutton unselectable mr5 clickable">
                            <Subtract16 className="unclickable"></Subtract16>
                        </div>

                        <div className="ml10 iblock unselectable">
                            {this.state.encoderDims.length} Layers
                        </div>
                    </div>
                </div>

                {/* Section titles */}
                <div className="flex mb10">
                    <div className="flex4 textaligncenter mediumdesc boldtext"> Encoder </div>
                    <div className="flex2 textaligncenter  mediumdesc boldtext"> Bottleneck </div>
                    <div className="flex4 textaligncenter  mediumdesc boldtext"> Decoder </div>
                </div>
                {/* Encoder, bottleneck, Decoder  */}
                <div className="flex">
                    <div className="iotextdata mr10 p5 border">
                        Input Data
                    </div>
                    <div ref="encoderbox" className="encoder greyhighlight rad4 pl5 flex4 mr10 ">
                        <div className="layerbar flex  flexjustifycenter pb10 pt10">
                            {encLayers}
                        </div>

                    </div>
                    <div ref="latentbox" className="bottlneck  flex2 mr10 ">
                        <div className="layerbar  h100 rad4 border flex  flexjustifycenter  ">

                            {latentLayers}
                        </div>
                    </div>
                    <div ref="decoderbox" className="decoder greyhighlight rad4 pl5 flex4 ">
                        <div className="layerbar flex   flexjustifycenter  pb10 pt10">
                            {decLayers}
                        </div>
                    </div>

                    <div className="iotextdata ml10 p5 border">
                        Output Data
                    </div>

                </div>

            </div>
        );
    }
}

export default ComposeModel;