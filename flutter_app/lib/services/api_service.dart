import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/foundation.dart';
import '../models/user.dart';
import '../models/vehicle.dart';

class ApiService {
  static const String baseUrl = 'https://vehicleq.onrender.com'; // Production backend URL

  // User Registration
  static Future<User> registerUser({
    required String username,
    required String email,
    required String password,
    required String fullName,
    required String phone,
  }) async {
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/register/'),
      );

      request.fields['username'] = username;
      request.fields['email'] = email;
      request.fields['password'] = password;
      request.fields['full_name'] = fullName;
      request.fields['phone'] = phone;

      final response = await request.send();
      final responseData = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(responseData));
      } else {
        throw Exception('Failed to register: ${jsonDecode(responseData)['detail']}');
      }
    } catch (e) {
      throw Exception('Registration error: $e');
    }
  }

  // User Login
  static Future<User> loginUser({
    required String username,
    required String password,
  }) async {
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/login/'),
      );

      request.fields['username'] = username;
      request.fields['password'] = password;

      final response = await request.send();
      final responseData = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(responseData));
      } else {
        throw Exception('Invalid username or password');
      }
    } catch (e) {
      throw Exception('Login error: $e');
    }
  }

  // Get User Profile
  static Future<User> getUserProfile(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/profile/$userId'),
      );

      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(response.body));
      } else {
        throw Exception('Failed to fetch profile');
      }
    } catch (e) {
      throw Exception('Error fetching profile: $e');
    }
  }

  // Update User Profile
  static Future<User> updateProfile({
    required int userId,
    required String fullName,
    required String phone,
  }) async {
    try {
      final request = http.MultipartRequest(
        'PUT',
        Uri.parse('$baseUrl/profile/$userId'),
      );

      request.fields['full_name'] = fullName;
      request.fields['phone'] = phone;

      final response = await request.send();
      final responseData = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(responseData));
      } else {
        throw Exception('Failed to update profile');
      }
    } catch (e) {
      throw Exception('Error updating profile: $e');
    }
  }

  // Get All Vehicles
  static Future<List<Vehicle>> getVehicles() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/vehicles/'),
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((v) => Vehicle.fromJson(v)).toList();
      } else {
        throw Exception('Failed to fetch vehicles');
      }
    } catch (e) {
      throw Exception('Error fetching vehicles: $e');
    }
  }

  // Get User's Vehicles
  static Future<List<Vehicle>> getUserVehicles(int userId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/vehicles/$userId'),
      );

      if (response.statusCode == 200) {
        List<dynamic> data = jsonDecode(response.body);
        return data.map((v) => Vehicle.fromJson(v)).toList();
      } else {
        throw Exception('Failed to fetch user vehicles');
      }
    } catch (e) {
      throw Exception('Error fetching vehicles: $e');
    }
  }

  // Upload Vehicle
  static Future<Vehicle> uploadVehicle({
    required int userId,
    required String vehicleNumber,
    required String owner,
    String? imagePath,
    Uint8List? imageBytes,
    String? filename,
  }) async {
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('$baseUrl/upload/'),
      );

      request.fields['user_id'] = userId.toString();
      request.fields['number'] = vehicleNumber;
      request.fields['owner'] = owner;
      if (imageBytes != null) {
        final name = filename ?? (imagePath != null ? imagePath.split('/').last : 'upload.jpg');
        request.files.add(
          http.MultipartFile.fromBytes('image', imageBytes, filename: name),
        );
      } else if (imagePath != null) {
        request.files.add(
          await http.MultipartFile.fromPath('image', imagePath),
        );
      } else {
        throw Exception('No image provided for upload');
      }

      final response = await request.send();
      final responseData = await response.stream.bytesToString();

      if (response.statusCode == 200) {
        return Vehicle.fromJson(jsonDecode(responseData));
      } else {
        throw Exception('Failed to upload vehicle');
      }
    } catch (e) {
      throw Exception('Upload error: $e');
    }
  }

  // Delete Vehicle
  static Future<bool> deleteVehicle(int vehicleId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/vehicle/$vehicleId'),
      );

      if (response.statusCode == 200) {
        return true;
      } else {
        throw Exception('Failed to delete vehicle');
      }
    } catch (e) {
      throw Exception('Error deleting vehicle: $e');
    }
  }

  // Get Image URL
  static String getImageUrl(int vehicleId) {
    return '$baseUrl/image/$vehicleId';
  }
}
