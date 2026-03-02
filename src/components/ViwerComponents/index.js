import { ReactSVG } from 'react-svg';
const SvgComponent = ({ svgUrl }) => {
    return <ReactSVG
        // width={200}
        // style={{
        //     display: "flex",
        //     margin: "auto",
        //     width:"200px",
        //     height:"200px"
        // }}
        src={svgUrl}
        beforeInjection={(svg) => {
            // svg.setAttribute('width', '120');
            svg.setAttribute('height', '50');
        }}
    />
}

export default SvgComponent;