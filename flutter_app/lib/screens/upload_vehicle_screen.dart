import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/vehicle_provider.dart';

class UploadVehicleScreen extends StatefulWidget {
  const UploadVehicleScreen({super.key});

  @override
  State<UploadVehicleScreen> createState() => _UploadVehicleScreenState();
}

class _UploadVehicleScreenState extends State<UploadVehicleScreen> {
  final _vehicleNumberController = TextEditingController();
  final _ownerController = TextEditingController();
  XFile? _selectedImage;
  Uint8List? _selectedImageBytes;
  final ImagePicker _imagePicker = ImagePicker();

  @override
  void dispose() {
    _vehicleNumberController.dispose();
    _ownerController.dispose();
    super.dispose();
  }

  Future<void> _pickImageFromCamera() async {
    try {
      final XFile? image = await _imagePicker.pickImage(source: ImageSource.camera);
      if (image != null) {
        final bytes = await image.readAsBytes();
        setState(() {
          _selectedImage = image;
          _selectedImageBytes = bytes;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    }
  }

  Future<void> _pickImageFromGallery() async {
    try {
      final XFile? image = await _imagePicker.pickImage(source: ImageSource.gallery);
      if (image != null) {
        final bytes = await image.readAsBytes();
        setState(() {
          _selectedImage = image;
          _selectedImageBytes = bytes;
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error picking image: $e')),
      );
    }
  }

  Future<void> _uploadVehicle() async {
    if (_vehicleNumberController.text.isEmpty ||
        _ownerController.text.isEmpty ||
        _selectedImage == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all fields and select an image')),
      );
      return;
    }

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final vehicleProvider = Provider.of<VehicleProvider>(context, listen: false);

    if (authProvider.user == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('User not authenticated')),
      );
      return;
    }

    await vehicleProvider.uploadVehicle(
      userId: authProvider.user!.id,
      vehicleNumber: _vehicleNumberController.text,
      owner: _ownerController.text,
      imagePath: _selectedImage?.path,
      imageBytes: _selectedImageBytes,
    );

    if (vehicleProvider.error == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vehicle uploaded successfully')),
      );
      _vehicleNumberController.clear();
      _ownerController.clear();
      setState(() {
        _selectedImage = null;
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: ${vehicleProvider.error}')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Upload Vehicle'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              const SizedBox(height: 16),
              Container(
                width: double.infinity,
                height: 250,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: _selectedImageBytes == null
                    ? const Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.image, size: 80, color: Colors.grey),
                            SizedBox(height: 16),
                            Text('No image selected'),
                          ],
                        ),
                      )
                    : Image.memory(_selectedImageBytes!, fit: BoxFit.cover),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _pickImageFromCamera,
                      icon: const Icon(Icons.camera_alt),
                      label: const Text('Camera'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: _pickImageFromGallery,
                      icon: const Icon(Icons.image_search),
                      label: const Text('Gallery'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              TextField(
                controller: _vehicleNumberController,
                decoration: const InputDecoration(
                  labelText: 'Vehicle Number',
                  hintText: 'e.g., ABC-1234',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.local_taxi),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _ownerController,
                decoration: const InputDecoration(
                  labelText: 'Owner Name',
                  hintText: 'Enter owner name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
              ),
              const SizedBox(height: 24),
              Consumer<VehicleProvider>(
                builder: (context, vehicleProvider, _) {
                  return SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: vehicleProvider.isLoading ? null : _uploadVehicle,
                      child: vehicleProvider.isLoading
                          ? const SizedBox(
                              height: 20,
                              width: 20,
                              child: CircularProgressIndicator(
                                valueColor: AlwaysStoppedAnimation(Colors.white),
                              ),
                            )
                          : const Text('Upload Vehicle'),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
