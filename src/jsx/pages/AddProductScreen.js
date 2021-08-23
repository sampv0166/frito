import React, { useEffect, useState } from 'react';
import './Style2.css';

import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import { Card, Col, Modal, Row } from 'react-bootstrap';
import TextField from '../components/TextField';
import Select from '../components/Select';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory } from '../../actions/categoryActions';
import { getShops } from '../../actions/shopActions';
import VariationOptions from './VariationOptions';
import ChooseVariationOptions from './ChooseVariationOptions';

const AddProductScreen = () => {
  const [hasVariant, setHasVariant] = useState({ checked: false });

  const [hasColor, setHasColor] = useState({ checked: false });
  const [hasSize, setHasSize] = useState({ checked: false });

  const [active, setActive] = useState({ checked: false });
  const [special, setSpecial] = useState({ checked: false });
  const [bestSeller, setBestSeller] = useState({ checked: false });
  const [offer, setOffer] = useState({ checked: false });

  const [productImageURL, setProductImageURL] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);

  const [showOptions, setShowOptions] = useState(false);
  const [show, setShow] = useState(false);

  const validateWithoutVariation = Yup.object({
    name_ar: Yup.string(),
    name_en: Yup.string().required('Required'),
    image: Yup.mixed().required('Required'),
    shop_id: Yup.number().required('Required'),
    description_ar: Yup.string(),
    description_en: Yup.string().required('Required'),
    category_id: Yup.number().required('Required'),
  });

  const validateWithVariation = Yup.object({
    name_ar: Yup.string(),
    name_en: Yup.string().required('Required'),
    image: Yup.mixed().required('Required'),
    shop_id: Yup.number().required('Required'),
    description_ar: Yup.string(),
    description_en: Yup.string().required('Required'),
    category_id: Yup.number().required('Required'),
    price: Yup.number().required('Required'),
    offerprice: Yup.number().required('Required'),
    hasoffer: Yup.number(),
    stocks: Yup.number().required('Required'),
  });

  const handleImageChange = (e, formik) => {
    if (e.target.files) {
      const U = URL.createObjectURL(e.target.files[0]);
      setProductImageURL(U);
      URL.revokeObjectURL(e.target.files);
    }

    formik.setFieldValue('image', e.currentTarget.files[0]);

    setProductImageFile(e.currentTarget.files[0]);
  };

  const renderImageUpload = (formik) => {
    return (
      <div>
        <Card
          className="my-2 p-1 rounded"
          style={{ height: '280px', objectFit: 'cover' }}
        >
          <Card.Img
            style={{ height: '270px', objectFit: 'contain', border: 'none' }}
            src={productImageURL}
            alt=""
            variant="top"
          />
        </Card>

        <div className="d-flex my-2">
          <label className="custom-file-upload w-100">
            <input
              type="file"
              onChange={(e) => handleImageChange(e, formik)}
              name="image"
            />
            <ErrorMessage
              component="div"
              className="error text-danger"
              name={'image'}
            />
            <i className="bx bx-cloud-upload mx-2"></i>Upload New Image
          </label>
        </div>
      </div>
    );
  };

  const renderPriceStock = (formik) => {
    return !hasVariant.checked ? (
      <div>
        <Row>
          <Col className="col-md-6">
            <TextField label="Price" name="price" type="number" />
          </Col>
          <Col className="col-md-6">
            <TextField label="Stock" name="stocks" type="number" />
          </Col>
        </Row>
        {offer.checked ? (
          <Row>
            <Col className="col-md-12">
              <TextField label="Offer Price" name="offerprice" type="number" />
            </Col>
          </Row>
        ) : (
          ''
        )}

        <Row>
          <Col className="col-md-6 my-4">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
                checked={offer.checked}
                onChange={(d) => {
                  offer.checked === true ? (d = false) : (d = true);
                  setOffer({ checked: d });
                  formik.setFieldValue('hasoffer', d);
                }}
              />

              <label className="form-check-label" for="flexSwitchCheckDefault">
                Has Offer
              </label>
            </div>
          </Col>
        </Row>
      </div>
    ) : (
      ''
    );
  };

  const renderVariantOptions = () => {
    return (
      <Modal show={showOptions} onHide={() => setShowOptions(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Choose Variation Options</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChooseVariationOptions
            setShowOptions={setShowOptions}
            setShow={setShow}
            hasColor={hasColor}
            setHasColor={setHasColor}
            hasSize={hasSize}
            setHasSize={setHasSize}
          />
        </Modal.Body>
      </Modal>
    );
  };

  const renderChooseVariantOptionsModal = () => {
    return (
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Variation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VariationOptions
            setShow={setShow}
            show={show}
            hasColor={hasColor}
            setHasColor={setHasColor}
            hasSize={hasSize}
            setHasSize={setHasSize}
          />
        </Modal.Body>
      </Modal>
    );
  };

  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { loading, categoryError, category } = categoryList;

  const shopList = useSelector((state) => state.shopList);
  const { shoploading, shopError, shop } = shopList;

  const populateCategory = () => {
    let objects = [category.length];
    for (var x = 0; x < category.length; x++) {
      objects[x] = { key: category[x].name, value: category[x].id };
    }
    objects.unshift({ key: 'choose', value: '' });
    return objects;
  };

  const populateShops = () => {
    let objects = [shop.length];
    for (var x = 0; x < shop.length; x++) {
      objects[x] = { key: shop[x].shop_name, value: shop[x].id };
    }
    objects.unshift({ key: 'choose', value: '' });
    return objects;
  };

  useEffect(() => {
    dispatch(getCategory());
    dispatch(getShops());
  }, [dispatch]);

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          name_ar: '',
          name_en: '',
          image: '',
          shop_id: '',
          description_ar: '',
          description_en: '',
          category_id: '',
          subcategory_id: '',
          bestseller: false,
          special: false,
          isactive: false,
        }}
        validationSchema={() =>
          hasVariant ? validateWithVariation : validateWithoutVariation
        }
        onSubmit={(values) => {}}
      >
        {(formik) => (
          <Form>
            <Row>
              <Col className="col-md-6">{renderImageUpload(formik)}</Col>
              <Col className="col-md-6">
                <Row>
                  <Col className="col-md-6">
                    <TextField label="Arabic Name" name="name_ar" type="text" />
                  </Col>
                  <Col className="col-md-6">
                    <TextField
                      label="English Name"
                      name="name_en"
                      type="text"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="col-md-6">
                    <TextField
                      label="Arabic Description"
                      name="description_ar"
                      type="text"
                    />
                  </Col>
                  <Col className="col-md-6">
                    <TextField
                      label="English Description"
                      name="description_en"
                      type="text"
                    />
                  </Col>
                </Row>

                <Row>
                  <Col className="col-md-6">
                    <Select
                      control="select"
                      label="Category"
                      name="category_id"
                      options={populateCategory()}
                    ></Select>
                  </Col>
                  <Col className="col-md-6">
                    <Select
                      control="select"
                      label="Shop Name"
                      name="shop_id"
                      options={populateShops()}
                    ></Select>
                  </Col>
                </Row>

                {renderPriceStock(formik)}
                <Row>
                  <Col>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={active.checked}
                        onChange={(d) => {
                          active.checked === true ? (d = false) : (d = true);
                          setActive({ checked: d });
                          formik.setFieldValue('isactive', d);
                        }}
                      />

                      <label
                        className="form-check-label"
                        for="flexSwitchCheckDefault"
                      >
                        Active Status
                      </label>
                    </div>
                  </Col>

                  <Col>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={special.checked}
                        onChange={(d) => {
                          special.checked === true ? (d = false) : (d = true);
                          setSpecial({ checked: d });
                          formik.setFieldValue('special', d);
                        }}
                      />
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckDefault"
                      >
                        Special
                      </label>
                    </div>
                  </Col>

                  <Col>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={bestSeller.checked}
                        onChange={(d) => {
                          bestSeller.checked === true
                            ? (d = false)
                            : (d = true);
                          setBestSeller({ checked: d });
                          formik.setFieldValue('bestseller', d);
                        }}
                      />
                      <label
                        className="form-check-label"
                        for="flexSwitchCheckDefault"
                      >
                        Best Seller
                      </label>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="flexSwitchCheckDefault"
                        checked={hasVariant.checked}
                        onChange={(d) => {
                          hasVariant.checked === true
                            ? (d = false)
                            : (d = true);
                          setHasVariant({ checked: d });
                        }}
                      />

                      <label
                        className="form-check-label"
                        for="flexSwitchCheckDefault"
                      >
                        Has Variant
                      </label>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="d-flex justify-content-end my-5">
              {hasVariant.checked ? (
                <div>
                  <button
                    className="text-nowrap btn btn-outline-success mx-2 rounded p-3 my-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowOptions(true);
                    }}
                  >
                    Add New Variation
                  </button>
                </div>
              ) : (
                ''
              )}
              <div>
                <button
                  className="text-nowrap btn btn-outline-success mx-2 rounded p-3 my-2"
                  type="submit"
                >
                  Save Product
                </button>
              </div>
            </div>

            {showOptions ? renderVariantOptions() : ''}
            {show ? renderChooseVariantOptionsModal() : ''}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddProductScreen;
