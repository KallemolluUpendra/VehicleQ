import 'dart:typed_data';
import 'package:flutter/material.dart';
import '../models/vehicle.dart';
import '../services/api_service.dart';

class VehicleProvider with ChangeNotifier {
  List<Vehicle> _vehicles = [];
  bool _isLoading = false;
  String? _error;

  List<Vehicle> get vehicles => _vehicles;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> fetchVehicles() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _vehicles = await ApiService.getVehicles();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> uploadVehicle({
    required int userId,
    required String vehicleNumber,
    required String owner,
    String? imagePath,
    Uint8List? imageBytes,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      Vehicle newVehicle = await ApiService.uploadVehicle(
        userId: userId,
        vehicleNumber: vehicleNumber,
        owner: owner,
        imagePath: imagePath,
        imageBytes: imageBytes,
      );
      _vehicles.add(newVehicle);
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> deleteVehicle(int vehicleId) async {
    try {
      bool success = await ApiService.deleteVehicle(vehicleId);
      if (success) {
        _vehicles.removeWhere((v) => v.id == vehicleId);
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }
}
