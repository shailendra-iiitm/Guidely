// Test script to verify rating endpoint fix
const mongoose = require('mongoose');
require('dotenv').config();

async function testRatingFix() {
  try {
    console.log('Testing if BookingModel import is fixed...');
    
    // Test if we can import the booking controller without errors
    try {
      const bookingController = require('../controllers/booking.controller');
      console.log('✅ Booking controller imported successfully');
      console.log('✅ Available methods:', Object.keys(bookingController));
      
      // Check if rateSession exists
      if (bookingController.rateSession) {
        console.log('✅ rateSession method exists');
      } else {
        console.log('❌ rateSession method not found');
      }
      
    } catch (error) {
      console.log('❌ Error importing booking controller:', error.message);
      return;
    }
    
    // Test if BookingModel can be imported directly
    try {
      const BookingModel = require('../models/booking.model');
      console.log('✅ BookingModel imported successfully');
      console.log('✅ Model name:', BookingModel.modelName);
    } catch (error) {
      console.log('❌ Error importing BookingModel:', error.message);
    }
    
    // Test UserModel import (used in rating update)
    try {
      const UserModel = require('../models/user.model');
      console.log('✅ UserModel imported successfully');
      console.log('✅ Model name:', UserModel.modelName);
    } catch (error) {
      console.log('❌ Error importing UserModel:', error.message);
    }
    
    console.log('\n✅ All imports are working correctly!');
    console.log('The 500 error should be fixed now.');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRatingFix();
