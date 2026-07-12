const fs = require('fs');

const categories = [
  { id: 'c0000000-0000-0000-0000-000000000001', name: 'IT Assets', description: 'Computers, laptops, tablets, scanners and peripheral storage devices' },
  { id: 'c0000000-0000-0000-0000-000000000002', name: 'Office Equipment', description: 'Printers, scanners, projectors, audio visual systems and digital displays' },
  { id: 'c0000000-0000-0000-0000-000000000003', name: 'Furniture', description: 'Workstations, desks, ergonomic chairs and storage cabinets' },
  { id: 'c0000000-0000-0000-0000-000000000004', name: 'Vehicles', description: 'Company cars, vans and electric transit scooters' },
  { id: 'c0000000-0000-0000-0000-000000000005', name: 'Networking Equipment', description: 'Routers, switches, firewalls and rack servers' },
  { id: 'c0000000-0000-0000-0000-000000000006', name: 'Security Equipment', description: 'Biometric terminals, CCTV cameras and physical security keys' },
  { id: 'c0000000-0000-0000-0000-000000000007', name: 'Electrical Equipment', description: 'UPS systems, backup power generators and HVAC units' },
  { id: 'c0000000-0000-0000-0000-000000000008', name: 'Machinery', description: 'Heavy workshop tools, 3D printers, CNC machines and lab microscopes' },
  { id: 'c0000000-0000-0000-0000-000000000009', name: 'Software & Licenses', description: 'Operating system and application software licenses' },
  { id: 'c0000000-0000-0000-0000-000000000010', name: 'Other', description: 'Physical conference, training and meeting facilities' }
];

const departments = [
  { id: 'd0000000-0000-0000-0000-000000000001', name: 'Administration' },
  { id: 'd0000000-0000-0000-0000-000000000002', name: 'Human Resources' },
  { id: 'd0000000-0000-0000-0000-000000000003', name: 'Finance' },
  { id: 'd0000000-0000-0000-0000-000000000004', name: 'IT' },
  { id: 'd0000000-0000-0000-0000-000000000005', name: 'Engineering' },
  { id: 'd0000000-0000-0000-0000-000000000006', name: 'Operations' },
  { id: 'd0000000-0000-0000-0000-000000000007', name: 'Production' },
  { id: 'd0000000-0000-0000-0000-000000000008', name: 'Maintenance' },
  { id: 'd0000000-0000-0000-0000-000000000009', name: 'Procurement' },
  { id: 'd0000000-0000-0000-0000-000000000010', name: 'Warehouse' },
  { id: 'd0000000-0000-0000-0000-000000000011', name: 'Sales' },
  { id: 'd0000000-0000-0000-0000-000000000012', name: 'Marketing' },
  { id: 'd0000000-0000-0000-0000-000000000013', name: 'Customer Support' },
  { id: 'd0000000-0000-0000-0000-000000000014', name: 'Research & Development' },
  { id: 'd0000000-0000-0000-0000-000000000015', name: 'Management' }
];

const assetsRaw = [
  // IT Assets
  { name: 'Dell Latitude 5440 Laptop', cat: 'IT Assets', is_shared: false, cost: 1200 },
  { name: 'HP EliteBook 840 G10', cat: 'IT Assets', is_shared: false, cost: 1400 },
  { name: 'Lenovo ThinkPad E14', cat: 'IT Assets', is_shared: false, cost: 1100 },
  { name: 'Apple MacBook Pro 14"', cat: 'IT Assets', is_shared: false, cost: 1999 },
  { name: 'Dell OptiPlex Desktop', cat: 'IT Assets', is_shared: false, cost: 950 },
  { name: 'Lenovo ThinkCentre Desktop', cat: 'IT Assets', is_shared: false, cost: 900 },
  { name: 'HP ProDesk Desktop', cat: 'IT Assets', is_shared: false, cost: 850 },
  { name: 'Reception Desktop', cat: 'IT Assets', is_shared: false, cost: 800 },
  { name: 'Finance Desktop', cat: 'IT Assets', is_shared: false, cost: 1000 },
  { name: 'HR Laptop', cat: 'IT Assets', is_shared: false, cost: 1200 },
  { name: 'Sales Laptop', cat: 'IT Assets', is_shared: false, cost: 1150 },
  { name: 'Development Laptop 01', cat: 'IT Assets', is_shared: false, cost: 1800 },
  { name: 'Development Laptop 02', cat: 'IT Assets', is_shared: false, cost: 1800 },
  { name: 'Development Laptop 03', cat: 'IT Assets', is_shared: false, cost: 1800 },
  { name: 'QA Testing Laptop', cat: 'IT Assets', is_shared: false, cost: 1300 },
  { name: 'Barcode Scanner', cat: 'IT Assets', is_shared: false, cost: 150 },
  { name: 'QR Code Scanner', cat: 'IT Assets', is_shared: false, cost: 180 },
  { name: 'RFID Reader', cat: 'IT Assets', is_shared: false, cost: 250 },
  { name: 'Warehouse Handheld Terminal', cat: 'IT Assets', is_shared: false, cost: 650 },
  { name: 'Tablet ( Samsung Galaxy Tab )', cat: 'IT Assets', is_shared: true, cost: 450 },
  { name: 'iPad Pro', cat: 'IT Assets', is_shared: true, cost: 999 },
  { name: 'Android Test Device', cat: 'IT Assets', is_shared: true, cost: 350 },
  { name: 'iPhone Test Device', cat: 'IT Assets', is_shared: true, cost: 799 },
  { name: 'Backup Storage Device', cat: 'IT Assets', is_shared: false, cost: 150 },
  { name: 'External Hard Drive', cat: 'IT Assets', is_shared: false, cost: 90 },

  // Office Equipment
  { name: 'Dell 24" Monitor', cat: 'Office Equipment', is_shared: false, cost: 220 },
  { name: 'LG UltraWide Monitor', cat: 'Office Equipment', is_shared: false, cost: 450 },
  { name: 'HP LaserJet Printer', cat: 'Office Equipment', is_shared: false, cost: 350 },
  { name: 'Canon ImageRunner Printer', cat: 'Office Equipment', is_shared: false, cost: 2500 },
  { name: 'Canon Scanner', cat: 'Office Equipment', is_shared: false, cost: 299 },
  { name: 'Epson Projector', cat: 'Office Equipment', is_shared: true, cost: 799 },
  { name: 'Interactive Smart Board', cat: 'Office Equipment', is_shared: true, cost: 2200 },
  { name: 'Video Conferencing System', cat: 'Office Equipment', is_shared: true, cost: 1500 },
  { name: 'Document Scanner', cat: 'Office Equipment', is_shared: false, cost: 399 },
  { name: 'Photocopier', cat: 'Office Equipment', is_shared: false, cost: 1800 },
  { name: 'Coffee Machine', cat: 'Office Equipment', is_shared: false, cost: 1200 },
  { name: 'Water Dispenser', cat: 'Office Equipment', is_shared: false, cost: 350 },
  { name: 'Digital Display Board', cat: 'Office Equipment', is_shared: false, cost: 899 },
  { name: 'Smart TV', cat: 'Office Equipment', is_shared: false, cost: 650 },
  { name: 'PA Speaker System', cat: 'Office Equipment', is_shared: false, cost: 499 },
  { name: 'Microphone Set', cat: 'Office Equipment', is_shared: false, cost: 199 },

  // Furniture
  { name: 'Office Workstation 01', cat: 'Furniture', is_shared: false, cost: 400 },
  { name: 'Office Workstation 02', cat: 'Furniture', is_shared: false, cost: 400 },
  { name: 'Office Workstation 03', cat: 'Furniture', is_shared: false, cost: 400 },
  { name: 'Office Workstation 04', cat: 'Furniture', is_shared: false, cost: 400 },
  { name: 'Office Workstation 05', cat: 'Furniture', is_shared: false, cost: 400 },
  { name: 'Office Chair', cat: 'Furniture', is_shared: false, cost: 180 },
  { name: 'Executive Desk', cat: 'Furniture', is_shared: false, cost: 650 },
  { name: 'Storage Cabinet', cat: 'Furniture', is_shared: false, cost: 250 },
  { name: 'Testing Workstation', cat: 'Furniture', is_shared: false, cost: 500 },

  // Vehicles
  { name: 'Company Car 01', cat: 'Vehicles', is_shared: true, cost: 25000 },
  { name: 'Company Car 02', cat: 'Vehicles', is_shared: true, cost: 28000 },
  { name: 'Delivery Van', cat: 'Vehicles', is_shared: true, cost: 32000 },
  { name: 'Electric Scooter', cat: 'Vehicles', is_shared: true, cost: 800 },

  // Networking Equipment
  { name: 'Cisco Router', cat: 'Networking Equipment', is_shared: false, cost: 850 },
  { name: 'Cisco Catalyst Switch', cat: 'Networking Equipment', is_shared: false, cost: 1200 },
  { name: 'Fortinet Firewall', cat: 'Networking Equipment', is_shared: false, cost: 1500 },
  { name: 'Synology NAS Server', cat: 'Networking Equipment', is_shared: false, cost: 999 },
  { name: 'Dell PowerEdge Server', cat: 'Networking Equipment', is_shared: false, cost: 4500 },
  { name: 'Network Test Server', cat: 'Networking Equipment', is_shared: false, cost: 2200 },

  // Security Equipment
  { name: 'Biometric Attendance Device', cat: 'Security Equipment', is_shared: false, cost: 450 },
  { name: 'CCTV Camera System', cat: 'Security Equipment', is_shared: false, cost: 3500 },
  { name: 'USB Security Key', cat: 'Security Equipment', is_shared: false, cost: 50 },

  // Electrical Equipment
  { name: 'UPS Unit', cat: 'Electrical Equipment', is_shared: false, cost: 600 },
  { name: 'Generator', cat: 'Electrical Equipment', is_shared: false, cost: 8500 },
  { name: 'Air Conditioner (Floor 1)', cat: 'Electrical Equipment', is_shared: false, cost: 1200 },
  { name: 'Air Conditioner (Floor 2)', cat: 'Electrical Equipment', is_shared: false, cost: 1200 },

  // Machinery
  { name: 'Forklift', cat: 'Machinery', is_shared: false, cost: 18000 },
  { name: '3D Printer', cat: 'Machinery', is_shared: false, cost: 2500 },
  { name: 'CNC Machine', cat: 'Machinery', is_shared: false, cost: 15000 },
  { name: 'Industrial Drill', cat: 'Machinery', is_shared: false, cost: 450 },
  { name: 'Hydraulic Press', cat: 'Machinery', is_shared: false, cost: 6500 },
  { name: 'Laboratory Microscope', cat: 'Machinery', is_shared: false, cost: 3500 },

  // Software & Licenses
  { name: 'Software License ( Microsoft 365 )', cat: 'Software & Licenses', is_shared: false, cost: 150 },
  { name: 'Software License ( Adobe Creative Cloud )', cat: 'Software & Licenses', is_shared: false, cost: 600 },
  { name: 'Software License ( AutoCAD )', cat: 'Software & Licenses', is_shared: false, cost: 1200 },

  // Other
  { name: 'Conference Room A', cat: 'Other', is_shared: true, cost: 5000 },
  { name: 'Conference Room B', cat: 'Other', is_shared: true, cost: 5000 },
  { name: 'Training Room', cat: 'Other', is_shared: true, cost: 8000 },
  { name: 'Meeting Room 1', cat: 'Other', is_shared: true, cost: 3000 },
  { name: 'Meeting Room 2', cat: 'Other', is_shared: true, cost: 3000 }
];

const batchStatements = [];

// 1. Categories
const catValues = categories.map(c => 
  `('${c.id}', '${c.name.replace(/'/g, "''")}', '${c.description.replace(/'/g, "''")}')`
).join(',\n  ');
batchStatements.push(`INSERT INTO public.categories (id, name, description) VALUES \n  ${catValues} \nON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description`);

// 2. Departments
const deptValues = departments.map(d => 
  `('${d.id}', '${d.name.replace(/'/g, "''")}', 'active')`
).join(',\n  ');
batchStatements.push(`INSERT INTO public.departments (id, name, status) VALUES \n  ${deptValues} \nON CONFLICT (name) DO UPDATE SET status = 'active'`);

// 3. Employees
batchStatements.push(
  `UPDATE public.employees SET department_id = 'd0000000-0000-0000-0000-000000000004' WHERE email = 'john.doe@example.com';
UPDATE public.employees SET department_id = 'd0000000-0000-0000-0000-000000000002' WHERE email = 'jane.smith@example.com';
UPDATE public.employees SET department_id = 'd0000000-0000-0000-0000-000000000004' WHERE department_id = 'd0000000-0000-0000-0000-000000000001';
UPDATE public.employees SET department_id = 'd0000000-0000-0000-0000-000000000002' WHERE department_id = 'd0000000-0000-0000-0000-000000000002';
UPDATE public.employees SET department_id = 'd0000000-0000-0000-0000-000000000003' WHERE department_id = 'd0000000-0000-0000-0000-000000000003'`
);

// 4. Truncations
batchStatements.push(
  `TRUNCATE public.resource_bookings, public.maintenance_requests, public.audit_items, public.audits, public.asset_allocations, public.assets CASCADE`
);

// 5. Assets (Splitted into 3 batches to avoid extremely long arguments, 25 + 25 + 24)
const assetsValues = [];
assetsRaw.forEach((asset, idx) => {
  const assetId = `a0000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`;
  const catObj = categories.find(c => c.name === asset.cat);
  const catId = catObj.id;
  const tag = `AST-${String(1000 + idx).padStart(4, '0')}`;
  const serial = `SN-${asset.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}-${idx + 1}`;
  const cond = idx % 5 === 0 ? 'new' : (idx % 5 === 4 ? 'fair' : 'good');
  const location = asset.is_shared ? `Facility Room ${idx % 5 + 1}` : `HQ Floor ${idx % 3 + 1}`;
  
  assetsValues.push(`('${assetId}', '${tag}', '${asset.name.replace(/'/g, "''")}', '${catId}', '${serial}', CURRENT_DATE - ${idx * 2}, ${asset.cost}, '${cond}', '${location}', NULL, 'available', ${asset.is_shared ? 'TRUE' : 'FALSE'})`);
});

const chunkSize = 25;
for (let i = 0; i < assetsValues.length; i += chunkSize) {
  const chunk = assetsValues.slice(i, i + chunkSize);
  batchStatements.push(`INSERT INTO public.assets (id, asset_tag, name, category_id, serial_number, acquisition_date, acquisition_cost, condition, location, current_holder_id, status, is_shared) VALUES \n  ${chunk.join(',\n  ')}`);
}

// 6. Resource Bookings & Maintenance
// Uses dynamically verified employee ID: f58c3cdd-b025-45e8-bd1b-d4e0de7cff53 (SAKTHIVEL P) and 8b1e4808-15d1-468a-ba43-087bb72ad725 (S. tharan)
batchStatements.push(
  `INSERT INTO public.resource_bookings (id, asset_id, booked_by, department_id, booking_date, start_time, end_time, purpose, booking_status) VALUES
  ('50000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000051', 'f58c3cdd-b025-45e8-bd1b-d4e0de7cff53', 'd0000000-0000-0000-0000-000000000002', CURRENT_DATE, CURRENT_DATE + TIME '09:00:00', CURRENT_DATE + TIME '11:00:00', 'HR recruitment drive', 'approved'),
  ('50000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000076', 'f58c3cdd-b025-45e8-bd1b-d4e0de7cff53', 'd0000000-0000-0000-0000-000000000002', CURRENT_DATE + 1, (CURRENT_DATE + 1) + TIME '14:00:00', (CURRENT_DATE + 1) + TIME '16:00:00', 'Project kickoff presentation', 'approved');

INSERT INTO public.maintenance_requests (id, asset_id, reported_by, assigned_to, priority, issue_description, scheduled_date, maintenance_status, maintenance_cost, remarks) VALUES
  ('60000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'f58c3cdd-b025-45e8-bd1b-d4e0de7cff53', '8b1e4808-15d1-468a-ba43-087bb72ad725', 'medium', 'Laptop runs extremely hot and fan makes squeaking noise', CURRENT_DATE + 1, 'pending', 0.00, 'Assigned to IT support for inspection')`
);

fs.writeFileSync('scratch/grouped_statements.json', JSON.stringify(batchStatements, null, 2));
console.log('Grouped statements generated:', batchStatements.length);
