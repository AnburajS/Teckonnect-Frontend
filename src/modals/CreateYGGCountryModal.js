import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';

const CreateYGGCountryModal = (props) => {
  const {
    showModal,
    editData,
    branchData,
    yggCountryOptions,
    setShowModal,
    fetchYGGMappedCountriesFunction,
  } = props;

  const [responseClassName, setResponseClassName] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [branchValue, setBranchValue] = useState([]);
  const [countryValue, setCountryValue] = useState(null);
  const [yggCountryData, setYGGCountryData] = useState([]);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [removeBranchIds, setRemoveBranchIds] = useState([]);
  const [originalBranches, setOriginalBranches] = useState([]);
  console.log(
    'countryValue',
    countryValue && countryValue?.label?.split('-')[1],
    branchData
  );
  useEffect(() => {
    const formattedCountries = yggCountryOptions.map(({ name, currency }) => ({
      value: name,
      label: `${name} - ${currency.code}`,
    }));
    setYGGCountryData(formattedCountries);
  }, [yggCountryOptions]);

  useEffect(() => {
    const hasBranch = Array.isArray(branchValue) && branchValue.length > 0;
    const hasCountry = !!(countryValue && countryValue.value);
    setIsButtonEnabled(hasBranch && hasCountry);

    if (editData?.countryEditMode) {
      // Calculate removed branches by comparing original with current selection
      const currentBranchIds = branchValue.map((branch) => branch.value);
      const removed = originalBranches
        .filter((branch) => !currentBranchIds.includes(branch.value))
        .map((branch) => branch.value);

      setRemoveBranchIds(removed);
    }
  }, [branchValue, countryValue, editData?.countryEditMode, originalBranches]);

  useEffect(() => {
    setBranchValue([]);
    setResponseClassName('');
    setResponseMsg('');
    setRemoveBranchIds([]);

    return () => {
      const collections = document.getElementsByClassName('modal-backdrop');
      for (let i = 0; i < collections.length; i++) {
        collections[i].remove();
      }
    };
  }, []);

  useEffect(() => {
    setResponseClassName('');
    setResponseMsg('');
    if (editData?.countryEditMode) {
      console.log('editData editData', editData);
      setCountryValue({
        value: editData.name,
        label: `${editData.name} - ${editData.currencyCode}`,
      });

      const branches = editData?.ygg_branches.map((branch) => ({
        value: branch.branch_id,
        label: branch.branch_name,
      }));

      setBranchValue(branches);
      setOriginalBranches(branches);
    }
  }, [editData?.countryEditMode]);

  const onBranchChangeHandler = (selected) => {
    setBranchValue(selected);
  };

  const onCountryChangeHandler = (selected) => {
    setCountryValue(selected);
    setBranchValue([]);
  };

  const addCountryMappingHandler = () => {
    if (
      !countryValue ||
      !countryValue.value ||
      !Array.isArray(branchValue) ||
      branchValue.length === 0
    ) {
      setResponseClassName('response-text response-err');
      setResponseMsg('Country and Branch are required');
      return;
    }

    const selectedCountry = yggCountryOptions.find(
      (item) => item.name === countryValue.value
    );

    if (!selectedCountry) {
      setResponseClassName('response-text response-err');
      setResponseMsg('Selected country details not found');
      return;
    }

    const branchIds = branchValue.map((branch) => branch.value);

    const payload = {
      method: editData ? 'update' : 'add',
      name: selectedCountry.name,
      code: selectedCountry.code,
      currencyName: selectedCountry.currency.name,
      currencyCode: selectedCountry.currency.code,
      addBranchIds: branchIds,
      removeBranchIds: removeBranchIds.length ? removeBranchIds : [],
      originalData: selectedCountry,
    };

    const obj = {
      url: URL_CONFIG.YGG_GET_COUNTRY,
      method: 'post',
      payload,
    };

    httpHandler(obj)
      .then((response) => {
        setResponseClassName('response-text response-succ');
        setResponseMsg(response?.data?.message);
        fetchYGGMappedCountriesFunction();
        props?.setisOpen(false);

        setShowModal({
          ...showModal,
          type: 'success',
          message: ' ',
          success: `Country Mapping ${
            props?.editData ? 'updated' : 'created'
          } successfully!`,
        });
      })
      .catch((error) => {
        setResponseClassName('response-text response-err');
        setResponseMsg(
          error?.response?.data?.message
            ? error?.response?.data?.message
            : error?.message
        );
      });
  };

  return (
    <div className="eepModalDiv">
      <div
        className="modal fade"
        id="CreateYGGCountryModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-confirm modal-addmessage"
          role="document"
          style={{ width: '400px' }}
        >
          <div className="modal-content">
            <div className="modal-header flex-column p-0">
              <button
                className="close closed"
                type="button"
                data-dismiss="modal"
                aria-label="Close"
                onClick={() => props?.setisOpen(false)}
              />
            </div>

            <div className="modal-body eep_scroll_y p-0">
              <div className="modalBodyHeight">
                <div className="p-3">
                  <div className="d-flex justify-content-center w-100 modal-icon-box">
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icons/adminpanel/yougotagift.png`}
                      className="modal-icon-image"
                      alt="Department"
                    />
                  </div>
                  <h5
                    className="modal-title w-100 text-center mt-3"
                    id="exampleModalLabel"
                  >
                    {props?.editData ? 'Update' : 'Create'} Country Mapping
                  </h5>
                </div>

                <div className="form-group field-wbr">
                  <Select
                    options={yggCountryData}
                    placeholder="Select Country *"
                    isSearchable
                    classNamePrefix="eep_select_common select"
                    className="a_designation basic-single"
                    name="CountrySelect"
                    id="countryselect"
                    onChange={onCountryChangeHandler}
                    isClearable
                    value={countryValue}
                  />
                </div>

                <div className="form-group field-wbr">
                  <Select
                    options={[
                      { label: 'Select All', value: 'all' },
                      ...branchData?.filter((data) => {
                        const currencyCode = data?.country?.currencyCode
                          ?.trim()
                          ?.toUpperCase();
                        const selectedCurrency = countryValue?.label
                          ?.split('-')[1]
                          ?.trim()
                          ?.toUpperCase();
                        return currencyCode === selectedCurrency;
                      }),
                    ]}
                    placeholder="Choose Branche(s) *"
                    isSearchable
                    classNamePrefix="eep_select_common select"
                    className="a_designation basic-single"
                    name="BranchSelect"
                    id="branchselect"
                    onChange={(selectedOptions) => {
                      const hasSelectAll = selectedOptions?.some(
                        (opt) => opt.value === 'all'
                      );
                      const filteredOptions = branchData?.filter((data) => {
                        const currencyCode = data?.country?.currencyCode
                          ?.trim()
                          ?.toUpperCase();
                        const selectedCurrency = countryValue?.label
                          ?.split('-')[1]
                          ?.trim()
                          ?.toUpperCase();
                        return currencyCode === selectedCurrency;
                      });

                      if (hasSelectAll) {
                        onBranchChangeHandler(filteredOptions);
                      } else {
                        onBranchChangeHandler(selectedOptions);
                      }
                    }}
                    isClearable
                    isMulti
                    value={branchValue}
                    maxMenuHeight={150}
                  />
                </div>

                {responseMsg && (
                  <p
                    style={{ textTransform: 'capitalize' }}
                    className={responseClassName}
                  >
                    {responseMsg}
                  </p>
                )}

                <div className="modal-footer justify-content-center p-0">
                  <button
                    className="eep-btn eep-btn-cancel eep-btn-xsml"
                    type="button"
                    data-dismiss="modal"
                    onClick={() => props?.setisOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="eep-btn eep-btn-success eep-btn-xsml add_newdepartment"
                    onClick={addCountryMappingHandler}
                    disabled={!isButtonEnabled}
                  >
                    {props?.editData ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateYGGCountryModal;
