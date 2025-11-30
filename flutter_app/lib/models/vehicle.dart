class Vehicle {
  final int id;
  final String number;
  final String owner;
  final String imagePath;
  final String timestamp;

  Vehicle({
    required this.id,
    required this.number,
    required this.owner,
    required this.imagePath,
    required this.timestamp,
  });

  factory Vehicle.fromJson(Map<String, dynamic> json) {
    return Vehicle(
      id: json['id'],
      number: json['number'],
      owner: json['owner'],
      imagePath: json['image_path'],
      timestamp: json['timestamp'],
    );
  }
}
