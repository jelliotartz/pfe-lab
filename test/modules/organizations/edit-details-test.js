import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { organization } from './test-data';

import EditDetails from '../../../src/modules/organizations/components/edit-details';

describe('EditDetails', () => {
  let wrapper;
  const resetSpy = sinon.spy();
  const updateSpy = sinon.spy();
  before(function() {
    wrapper = mount(
      <EditDetails organization={organization} resetOrganization={resetSpy} updateOrganization={updateSpy} />,
    );
  });

  it('should mount', () => {
    expect(wrapper.type()).to.equal(EditDetails);
  });

  describe('form', function() {
    it('should have a <FormContainer />', function() {
      expect(wrapper.find('FormContainer')).to.have.length(1);
    });

    // it('should have a <NameInput />', function() {
    //   expect(wrapper.find('NameInput')).to.have.length(1);
    // });

    // it('should have a <DescriptionInput />', function() {
    //   expect(wrapper.find('DescriptionInput')).to.have.length(1);
    // });

    it('should collect input values and call submit on click', function() {
      wrapper.find('input[type="text"]').simulate('change', { target: { value: 'a new name' } });
      wrapper.find('textarea').simulate('change', { target: { value: 'description' } });
      wrapper.find('button[type="submit"]').simulate('click');

      console.log('args', updateSpy.getCall(0).args)
      // expect(updateSpy.calledOnce).to.be.true;
    });
  });
});
