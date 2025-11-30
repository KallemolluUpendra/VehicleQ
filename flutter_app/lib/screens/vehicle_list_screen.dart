import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dart:ui';
import '../models/vehicle.dart';
import '../providers/vehicle_provider.dart';
import '../services/api_service.dart';

class VehicleListScreen extends StatefulWidget {
  const VehicleListScreen({super.key});

  @override
  State<VehicleListScreen> createState() => _VehicleListScreenState();
}

class _VehicleListScreenState extends State<VehicleListScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      Provider.of<VehicleProvider>(context, listen: false).fetchVehicles();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Vehicles'),
        centerTitle: true,
      ),
      body: Consumer<VehicleProvider>(
        builder: (context, vehicleProvider, _) {
          if (vehicleProvider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (vehicleProvider.vehicles.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.directions_car, size: 80, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No vehicles found'),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => vehicleProvider.fetchVehicles(),
            child: ListView.builder(
              itemCount: vehicleProvider.vehicles.length,
              itemBuilder: (context, index) {
                Vehicle vehicle = vehicleProvider.vehicles[index];
                return VehicleCard(vehicle: vehicle, index: index);
              },
            ),
          );
        },
      ),
    );
  }
}

class VehicleCard extends StatelessWidget {
  final Vehicle vehicle;
  final int index;

  const VehicleCard({super.key, required this.vehicle, required this.index});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Row(
          children: [
            // Thumbnail
            GestureDetector(
              onTap: () async {
                // Show full-screen lightbox with swipe and pinch/zoom
                final provider = Provider.of<VehicleProvider>(context, listen: false);
                final vehicles = provider.vehicles;
                final controller = PageController(initialPage: index);
                await showGeneralDialog(
                  context: context,
                  barrierDismissible: true,
                  barrierLabel: 'ImageViewer',
                  pageBuilder: (context, animation, secondaryAnimation) {
                    final screenSize = MediaQuery.of(context).size;
                    final dialogWidth = screenSize.width * 0.9;
                    final dialogHeight = screenSize.height * 0.7;
                    return Center(
                      child: Container(
                        width: dialogWidth,
                        height: dialogHeight,
                        decoration: BoxDecoration(
                          color: Theme.of(context).dialogBackgroundColor,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Stack(
                          children: [
                            PageView.builder(
                              controller: controller,
                              itemCount: vehicles.length,
                              itemBuilder: (context, pageIndex) {
                                final v = vehicles[pageIndex];
                                return Center(
                                  child: InteractiveViewer(
                                    panEnabled: true,
                                    minScale: 1.0,
                                    maxScale: 4.0,
                                    child: Hero(
                                      tag: 'vehicle-image-${v.id}',
                                      child: Image.network(
                                        ApiService.getImageUrl(v.id),
                                        fit: BoxFit.contain,
                                        errorBuilder: (context, error, stackTrace) => Container(
                                          color: Colors.grey[200],
                                          child: const Icon(Icons.broken_image, size: 80, color: Colors.grey),
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                            Positioned(
                              right: 4,
                              top: 4,
                              child: IconButton(
                                icon: const Icon(Icons.close),
                                onPressed: () => Navigator.of(context).pop(),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                  transitionBuilder: (context, animation, secondaryAnimation, child) {
                    return BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 6.0 * animation.value, sigmaY: 6.0 * animation.value),
                      child: FadeTransition(
                        opacity: animation,
                        child: ScaleTransition(
                          scale: Tween<double>(begin: 0.95, end: 1.0).animate(CurvedAnimation(parent: animation, curve: Curves.easeOutBack)),
                          child: child,
                        ),
                      ),
                    );
                  },
                );
              },
              child: ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: Hero(
                  tag: 'vehicle-image-${vehicle.id}',
                  child: Image.network(
                    ApiService.getImageUrl(vehicle.id),
                    height: 120,
                    width: 120,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        height: 120,
                        width: 120,
                        color: Colors.grey[300],
                        child: const Icon(Icons.broken_image, size: 48, color: Colors.grey),
                      );
                    },
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            // Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Vehicle Number', style: TextStyle(fontSize: 12, color: Colors.grey)),
                            Text(vehicle.number, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                      Chip(label: const Text('Own'), backgroundColor: Colors.blue[100]),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text('Owner', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  Text(vehicle.owner, style: const TextStyle(fontSize: 14)),
                  const SizedBox(height: 8),
                  const Text('Uploaded', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  Text(vehicle.timestamp, style: const TextStyle(fontSize: 12)),
                ],
              ),
            ),
            // Actions
            Column(
              children: [
                IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red),
                  onPressed: () async {
                    final confirm = await showDialog<bool>(
                      context: context,
                      builder: (context) => AlertDialog(
                        title: const Text('Delete vehicle'),
                        content: const Text('Are you sure you want to delete this vehicle entry?'),
                        actions: [
                          TextButton(onPressed: () => Navigator.of(context).pop(false), child: const Text('Cancel')),
                          TextButton(onPressed: () => Navigator.of(context).pop(true), child: const Text('Delete')),
                        ],
                      ),
                    );
                    if (confirm == true) {
                      final provider = Provider.of<VehicleProvider>(context, listen: false);
                      await provider.deleteVehicle(vehicle.id);
                      final err = provider.error;
                      if (err == null) {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Vehicle deleted')));
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Delete failed: $err')));
                      }
                    }
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
