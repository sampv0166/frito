import React, { useState } from 'react';
import Wizard from '../components/Forms/Wizard/Wizard';
import { Card, Row, Tab, Tabs } from 'react-bootstrap';
import TextField from '../components/TextField';
import { Form, Formik } from 'formik';
import { SketchPicker } from 'react-color';

const VariationOptions = ({
  setShow,
  setShowOptions,
  hasColor,
  setHasColor,
  hasSize,
  setHasSize,
}) => {
  const [color, setColor] = useState('FAF5F5');
  const [offer, setOffer] = useState({ checked: false });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [formikFileArray, setFormikFileArray] = useState([]);

  const handleVariationImageChange = async (e, formik) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );

      setSelectedFiles((prevImages) => prevImages.concat(filesArray));

      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }

    const files = Array.from(e.target.files).map((file) => file);

    console.log(files);

    Array.from(e.target.files).forEach((file) => {
      formikFileArray.push(file);
    });

    console.log(formikFileArray);

    formik.setFieldValue('images', formikFileArray);
  };

  const renderPhotos = (source, formik) => {
    return source.map((photo, index) => {
      return (
        <div className="col w-100">
          <Card
            className="my-2 p-1 rounded"
            style={{ height: '180px', objectFit: 'contain' }}
          >
            <Card.Img
              style={{ height: '170px', objectFit: 'contain' }}
              src={photo}
              variant="top"
              key={photo}
            />
            <button
              onClick={(e) =>
                handleRemoveVariationImage(
                  e,
                  source[index],
                  index,
                  source,
                  formikFileArray,
                  formik
                )
              }
              type="button px-1"
              className="btn btn-white text-danger rounded fs-3"
              style={{ position: 'absolute' }}
            >
              <i className="bx bx-trash"></i>
            </button>
          </Card>
        </div>
      );
    });
  };

  const handleRemoveVariationImage = (
    e,
    fileToRemove,
    index,
    source,
    formikFileArray,
    formik
  ) => {
    e.preventDefault();

    source = source.filter((fileName) => fileName !== fileToRemove);
    console.log(source);
    formikFileArray.filter((fileName) => fileName !== fileToRemove);

    setSelectedFiles(source);
    const files = Array.from(formikFileArray).filter((file, i) => index !== i);
    formik.setFieldValue('images', files);
    console.log(files);
    setFormikFileArray(files);
    //console.log(fileimages);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={{
        images: [],
        price: '',
        offerprice: '',
        stocks: '',
        color_name: '',
        color_value: '',
        hasoffer: '',
        size_value: '',
      }}
      onSubmit={(values, { resetForm }) => {}}
    >
      {(formik) => (
        <Form>
          <Tabs
            defaultActiveKey="details"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="details" title="DETAILS">
              <div>
                <div>
                  <div className="row g-3">
                    <div className="my-4">
                      <label
                        style={{ cursor: 'pointer' }}
                        className="text-nowrap border shadow py-3 px-4 bg-white text-success add-photo rounded w-100"
                        htmlFor="file"
                      >
                        <i className="bx bx-image-add my-5 mx-4"> </i>
                      </label>
                    </div>
                    <div className="col">
                      <input
                        name="images"
                        type="file"
                        id="file"
                        multiple
                        onChange={(e) => handleVariationImageChange(e, formik)}
                      />
                      <div className="result">
                        <Row>{renderPhotos(selectedFiles, formik)}</Row>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <TextField
                        className="form-control shadow-none rounded"
                        label="Price"
                        name="price"
                        type="number"
                      />
                    </div>
                    <div className="col-md-6">
                      <TextField label="Stock" name="stocks" type="number" />
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div class="form-check form-switch">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          id="flexSwitchCheckDefault"
                          checked={offer.checked}
                          onChange={(d) => {
                            offer.checked === true ? (d = false) : (d = true);
                            setOffer({ checked: d });
                            formik.setFieldValue('hasoffer', d);
                          }}
                        />
                        {console.log(formik.values)}
                        <label
                          class="form-check-label"
                          for="flexSwitchCheckDefault"
                        >
                          Has Offer
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <TextField
                        label="Offer Price"
                        name="offerprice"
                        type="number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Tab>

            <Tab eventKey="choose" title="Variant Options">
              <div className="row g-3 mx-1">
                {hasColor.checked ? (
                  <div className="col-md-6">
                    <TextField
                      label="Color Name"
                      name="color_name"
                      type="text"
                    />
                  </div>
                ) : (
                  ''
                )}

                {hasSize.checked ? (
                  <div className="col-md-6">
                    <TextField label="Size" name="size_value" type="text" />
                  </div>
                ) : (
                  ''
                )}
              </div>
              {hasColor.checked ? (
                <div className="col-md-12">
                  <SketchPicker
                    color={color}
                    onChange={(updatedColor) => {
                      setColor(updatedColor.hex);
                      formik.setFieldValue('color_value', updatedColor.hex);
                    }}
                    width="300px"
                  />
                </div>
              ) : (
                ''
              )}
            </Tab>
          </Tabs>
        </Form>
      )}
    </Formik>
  );
};

export default VariationOptions;
