import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider with ChangeNotifier {
  User? _user;
  bool _isLoggedIn = false;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoggedIn => _isLoggedIn;
  bool get isLoading => _isLoading;
  String? get error => _error;

  AuthProvider() {
    _loadUserFromPreferences();
  }

  Future<void> _loadUserFromPreferences() async {
    try {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      String? userId = prefs.getString('user_id');
      if (userId != null) {
        _isLoggedIn = true;
        notifyListeners();
      }
    } catch (e) {
      _error = e.toString();
    }
  }

  Future<bool> register({
    required String username,
    required String email,
    required String password,
    required String fullName,
    required String phone,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await ApiService.registerUser(
        username: username,
        email: email,
        password: password,
        fullName: fullName,
        phone: phone,
      );

      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setInt('user_id', _user!.id);
      await prefs.setString('username', _user!.username);

      _isLoggedIn = true;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> login({
    required String username,
    required String password,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await ApiService.loginUser(
        username: username,
        password: password,
      );

      SharedPreferences prefs = await SharedPreferences.getInstance();
      await prefs.setInt('user_id', _user!.id);
      await prefs.setString('username', _user!.username);

      _isLoggedIn = true;
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('user_id');
    await prefs.remove('username');
    _user = null;
    _isLoggedIn = false;
    notifyListeners();
  }

  Future<void> updateProfile({
    required String fullName,
    required String phone,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await ApiService.updateProfile(
        userId: _user!.id,
        fullName: fullName,
        phone: phone,
      );
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshProfile() async {
    if (_user == null) return;
    try {
      _user = await ApiService.getUserProfile(_user!.id);
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }
}
