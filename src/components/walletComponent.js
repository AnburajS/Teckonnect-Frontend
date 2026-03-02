import React, { useEffect, useState } from "react";

const WalletComponent = (props) => {

    const [wallet, setWallet] = useState('');
    const [err, setError] = useState(false);
    const [disable, setDisabled] = useState(true);

    useEffect(() => {

        setWallet(props?.row?.[props?.inputkey])
    }, [props?.row?.[props?.inputkey]]);


    const handleInputChange = (event, key) => {
        const { value } = event.target;

        if (/^\d*$/.test(value)) {
            setDisabled(false)
            setWallet(value)
        }
    };

    const handleSave = () => {
        if (!wallet) {
            setError(true)
            return
        }
        if (props.inputkey === 'optimal_value' && parseInt(wallet) > parseInt(props?.state?.points?.allocated_value)) {
            setError(true)
            return
        } else if (props.inputkey === 'allocated_value' && parseInt(props?.state?.points?.optimal_value) > parseInt(wallet)) {
            setError(true)
            return
        } else {
            setError('')
            props?.addWalletPoints({ [props.inputkey]: wallet }, props?.row)
            setError(false)
            setDisabled(true)
        }
    }

    return (
        <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input value={wallet} type="text" className={`tableinput form-control field-input ${err && "error-validation-input"}`} onChange={(e) => handleInputChange(e, 'optimal_value')} />
                <div className="tableButton ml-1">
                    <button disabled={disable}
                        style={{ borderRadius: 6 }}
                        className="small-eep-btn eep-btn-success"
                        onClick={handleSave}>
                        {/* {parseInt(props?.row?.[props?.inputkey]) > 0 ? 'Update' : 'Save'} */}Save
                    </button>
                    {/* {err && <label style={{ fontSize: 11, color: "red" }}>{err}</label>} */}
                </div>
            </div>
        </React.Fragment>
    );
};
export default WalletComponent;