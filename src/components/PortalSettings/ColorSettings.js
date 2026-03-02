import React from "react";

const ColorSettings = (props) => {

  const theamSelectHandler = (arg) => {
    let removeClassName = document.querySelectorAll(".theam_container");
    for (var i = 0; i < removeClassName.length; i++) {
      removeClassName[i].classList.remove('active-setting');
    }
    let addClassName = document.getElementById(arg);
    addClassName.classList.add("active-setting");

    props.setState({ ...props.state, ['color']: arg })
  }

  React.useEffect(() => {
    
    if (props?.state?.color) {
      let removeClassName = document.querySelectorAll(".theam_container");
      for (var i = 0; i < removeClassName.length; i++) {
        removeClassName[i].classList.remove('active-setting');
      }
      let addClassName = document.getElementById(props.state.color);
      addClassName.classList.add("active-setting");
    }
  }, [])

  return (
    <React.Fragment>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span> Select Theme Color </span></div>
      </div>

      <div className="eep_scroll_y" style={{ height: "85%" }}>

        <div className="row no-gutter">

          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 eep_scroll_y">
            <div id="color_one" className="theam_container active-setting" onClick={() => theamSelectHandler("color_one")}>
              <p className="title">Default</p>
              <div className="color_spectrum d-flex">
              <div className="color_3" style={{ backgroundColor: "#244AC4" }}></div>
              <div className="color_2" style={{ backgroundColor: "#1D2A57" }}></div>
                <div className="color_1" style={{ backgroundColor: "#00030D" }}></div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div id="color_two" className="theam_container" onClick={() => theamSelectHandler("color_two")}>
              <p className="title">Light</p>
              <div className="color_spectrum d-flex">
                <div className="color_1" style={{ backgroundColor: "#EFEFEF" }}></div>
                <div className="color_2" style={{ backgroundColor: "#9e9e9e" }}></div>
                <div className="color_3" style={{ backgroundColor: "#6e6c6c" }}></div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div id="color_three" className="theam_container" onClick={() => theamSelectHandler("color_three")}>
              <p className="title">Dark</p>
              <div className="color_spectrum d-flex">
                <div className="color_1" style={{ backgroundColor: "#273c2ccc" }}></div>
                <div className="color_2" style={{ backgroundColor: "#273C2C" }}></div>
                <div className="color_3" style={{ backgroundColor: "#001C07" }}></div>
              </div>
            </div>
          </div>

          {/* <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div id="color_four" className="theam_container" onClick={() => theamSelectHandler("color_four")}>
              <p className="title">Ocean</p>
              <div className="color_spectrum d-flex">
                <div className="color_1" style={{ backgroundColor: "#99FFEE" }}></div>
                <div className="color_2" style={{ backgroundColor: "#A2EDF6" }}></div>
                <div className="color_3" style={{ backgroundColor: "#98DDFA" }}></div>
              </div>
            </div>
          </div> */}

        </div>
      </div>

    </React.Fragment>
  );
};

export default ColorSettings;
