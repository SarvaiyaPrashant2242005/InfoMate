// Static course data with semesters and subjects. Place corresponding PDFs under client/public/pdfs/
// Example path: client/public/pdfs/diploma/sem1/mathematics_i.pdf

export const COURSES = [
  {
    id: 'diploma',
    name: 'Diploma',
    type: 'Diploma Program',
    semesters: [
      {
        id: 'sem1',
        name: 'Semester 1',
        subjects: [
          { id: 'dip-sem1-sub1', name: 'Applied Mathematics I', file: '/pdfs/diploma/sem1/applied_mathematics_1.pdf' },
          { id: 'dip-sem1-sub2', name: 'Basic Electrical Engineering', file: '/pdfs/diploma/sem1/basic_electrical_engineering.pdf' },
          { id: 'dip-sem1-sub3', name: 'Engineering Graphics', file: '/pdfs/diploma/sem1/engineering_graphics.pdf' },
          { id: 'dip-sem1-sub4', name: 'Communication Skills', file: '/pdfs/diploma/sem1/communication_skills.pdf' }
        ]
      },
      { id: 'sem2', name: 'Semester 2', subjects: [
        { id: 'dip-sem2-sub1', name: 'Applied Mathematics II', file: '/pdfs/diploma/sem2/applied_mathematics_2.pdf' },
        { id: 'dip-sem2-sub2', name: 'Computer Programming', file: '/pdfs/diploma/sem2/computer_programming.pdf' },
        { id: 'dip-sem2-sub3', name: 'Physics', file: '/pdfs/diploma/sem2/physics.pdf' }
      ] },
      { id: 'sem3', name: 'Semester 3', subjects: [
        { id: 'dip-sem3-sub1', name: 'Data Structures', file: '/pdfs/diploma/sem3/data_structures.pdf' },
        { id: 'dip-sem3-sub2', name: 'Digital Electronics', file: '/pdfs/diploma/sem3/digital_electronics.pdf' }
      ] },
      { id: 'sem4', name: 'Semester 4', subjects: [
        { id: 'dip-sem4-sub1', name: 'Database Management Systems', file: '/pdfs/diploma/sem4/dbms.pdf' },
        { id: 'dip-sem4-sub2', name: 'Operating Systems', file: '/pdfs/diploma/sem4/operating_systems.pdf' }
      ] },
      { id: 'sem5', name: 'Semester 5', subjects: [
        { id: 'dip-sem5-sub1', name: 'Computer Networks', file: '/pdfs/diploma/sem5/computer_networks.pdf' },
        { id: 'dip-sem5-sub2', name: 'Web Technologies', file: '/pdfs/diploma/sem5/web_technologies.pdf' }
      ] },
      { id: 'sem6', name: 'Semester 6', subjects: [
        { id: 'dip-sem6-sub1', name: 'Software Engineering', file: '/pdfs/diploma/sem6/software_engineering.pdf' },
        { id: 'dip-sem6-sub2', name: 'Mobile Application Development', file: '/pdfs/diploma/sem6/mobile_app_development.pdf' }
      ] }
    ]
  },
  {
    id: 'degree',
    name: 'Degree',
    type: 'Bachelor Program',
    semesters: [
      { id: 'sem1', name: 'Semester 1', subjects: [
        { id: '01MA1101', name: '01MA1101 – Differential and Integral Calculus', file: '/pdfs/degree/sem1/differential_and_integral_calculus.pdf' },
        { id: '01EE0104', name: '01EE0104 – Electrical Circuits', file: '/pdfs/degree/sem1/electrical_circuits.pdf' },
        { id: '01EC0101', name: '01EC0101 – Basics of Electronics Engineering', file: '/pdfs/degree/sem1/basics_of_electronics_engineering.pdf' },
        { id: '01SL0102-01SL0103', name: '01SL0102 / 01SL0103 – Reading & Writing for Technology / Speaking & Presentation Skills', file: '/pdfs/degree/sem1/reading_writing_or_speaking_presentation_skills.pdf' },
        { id: '01CT0101', name: '01CT0101 – Introduction to Computer Programming', file: '/pdfs/degree/sem1/introduction_to_computer_programming.pdf' },
        { id: '01CT0103', name: '01CT0103 – Foundation Skills in Sensor Interfacing', file: '/pdfs/degree/sem1/foundation_skills_in_sensor_interfacing.pdf' },
        { id: '01CT0104', name: '01CT0104 – ICT Workshop', file: '/pdfs/degree/sem1/ict_workshop.pdf' },
        { id: '01PE0101', name: '01PE0101 – Physical Education/Sports/Yoga', file: '/pdfs/degree/sem1/physical_education_sports_yoga.pdf' }
      ] },
      { id: 'sem2', name: 'Semester 2', subjects: [
        { id: '01MA1151', name: '01MA1151 – Matrix Algebra and Vector Calculus', file: '/pdfs/degree/sem2/matrix_algebra_and_vector_calculus.pdf' },
        { id: '01EC0102', name: '01EC0102 – Digital Electronics', file: '/pdfs/degree/sem2/digital_electronics.pdf' },
        { id: '01ME0105', name: '01ME0105 – Engineering Drawing and Computer Aided Design', file: '/pdfs/degree/sem2/engineering_drawing_and_cad.pdf' },
        { id: '01CT0105', name: '01CT0105 – Object Oriented Programming', file: '/pdfs/degree/sem2/object_oriented_programming.pdf' },
        { id: '01EN0101', name: '01EN0101 – Basics of Environmental Studies', file: '/pdfs/degree/sem2/basics_of_environmental_studies.pdf' },
        { id: '01CT0106', name: '01CT0106 – Introduction to R and R Studio', file: '/pdfs/degree/sem2/introduction_to_r_and_r_studio.pdf' },
        { id: '01CR0103', name: '01CR0103 – Value Education', file: '/pdfs/degree/sem2/value_education.pdf' }
      ] },
      { id: 'sem3', name: 'Semester 3', subjects: [
        { id: '01CT0308', name: 'Data Structure using C++ - 01CT0308', file: '/pdfs/degree/sem3/data_structure_using_cpp.pdf' },
        { id: '01CT1302', name: 'Signal and System - 01CT1302', file: '/pdfs/degree/sem3/signal_and_system.pdf' },
        { id: '01CT0310', name: 'Discrete Mathematics and Graph Theory - 01CT0310', file: '/pdfs/degree/sem3/discrete_mathematics_and_graph_theory.pdf' },
        { id: '01CT1303', name: 'Introduction to Communication Engineering - 01CT1303', file: '/pdfs/degree/sem3/introduction_to_communication_engineering.pdf' },
        { id: '01CT0301', name: 'Computer Organization and Architechture - 01CT0301', file: '/pdfs/degree/sem3/computer_organization_and_architecture.pdf' },
        { id: '01CT1309', name: 'Programming with Python - 01CT1309', file: '/pdfs/degree/sem3/programming_with_python.pdf' }
      ] },
      { id: 'sem4', name: 'Semester 4', subjects: [
        { id: '01CT0404', name: 'Analog and Digital Communication - 01CT0404', file: '/pdfs/degree/sem4/analog_and_digital_communication.pdf' },
        { id: '01CT0407', name: 'Database Management System - 01CT0407', file: '/pdfs/degree/sem4/database_management_system.pdf' },
        { id: '01CT0403', name: 'Microcontroller and Interfacing - 01CT0403', file: '/pdfs/degree/sem4/microcontroller_and_interfacing.pdf' },
        { id: '01CT0410', name: 'Datavisualization and Dashboard - 01CT0410', file: '/pdfs/degree/sem4/data_visualization_and_dashboard.pdf' },
        { id: '01CT1401', name: 'Probability and Statistics - 01CT1401', file: '/pdfs/degree/sem4/probability_and_statistics.pdf' },
        { id: '01CT1409', name: 'Operating Systems - 01CT1409', file: '/pdfs/degree/sem4/operating_systems.pdf' }
      ] },
      { id: 'sem5', name: 'Semester 5', subjects: [
        { id: '01CT0503', name: '01CT0503 - Computer Networks (Mandatory)', file: '/pdfs/degree/sem5/computer_networks.pdf' },
        { id: '01CT0512', name: '01CT0512 - Design and Analysis of Algorithm (Mandatory)', file: '/pdfs/degree/sem5/design_and_analysis_of_algorithms.pdf' },
        { id: '01CT0513', name: '01CT0513 - Digital Signal and Image Processing (Mandatory)', file: '/pdfs/degree/sem5/digital_signal_and_image_processing.pdf' },
        { id: '01CT0521', name: '01CT0521 - Creativity, Problem Solving and Innovation (Mandatory)', file: '/pdfs/degree/sem5/creativity_problem_solving_and_innovation.pdf' },
        { id: '01CT0507', name: '01CT0507 - Advanced Microprocessor (Elective)', file: '/pdfs/degree/sem5/advanced_microprocessor.pdf' },
        { id: '01CT0508', name: '01CT0508 - Optical Communication (Elective)', file: '/pdfs/degree/sem5/optical_communication.pdf' },
        { id: '01CT1509', name: '01CT1509 - Linux Administration (Elective)', file: '/pdfs/degree/sem5/linux_administration.pdf' },
        { id: '01CT1510', name: '01CT1510 - Applied Linear algebra (Elective)', file: '/pdfs/degree/sem5/applied_linear_algebra.pdf' },
        { id: '01CT0518', name: '01CT0518 - .Net Technologies (Elective)', file: '/pdfs/degree/sem5/dotnet_technologies.pdf' },
        { id: '01CT0514', name: '01CT0514 - VLSI Design (Elective)', file: '/pdfs/degree/sem5/vlsi_design.pdf' },
        { id: '01CT0516', name: '01CT0516 - Engineering Electrodynamics (Elective)', file: '/pdfs/degree/sem5/engineering_electrodynamics.pdf' },
        { id: '01CT0515', name: '01CT0515 - Information and Web Security (Elective)', file: '/pdfs/degree/sem5/information_and_web_security.pdf' },
        { id: '01CT0519', name: '01CT0519 - Machine Learning (Elective)', file: '/pdfs/degree/sem5/machine_learning.pdf' },
        { id: '01CT0517', name: '01CT0517 - Cross Platform Mobile Application Development (Elective)', file: '/pdfs/degree/sem5/cross_platform_mobile_application_development.pdf' }
      ] },
      { id: 'sem6', name: 'Semester 6', subjects: [
        { id: '01CT0614', name: '01CT0614 - Optimization Techniques (Mandatory)', file: '/pdfs/degree/sem6/optimization_techniques.pdf' },
        { id: '01CT0615', name: '01CT0615 - Software Engineering (Mandatory)', file: '/pdfs/degree/sem6/software_engineering.pdf' },
        { id: '01CT0616', name: '01CT0616 - Artificial Intelligence (Mandatory)', file: '/pdfs/degree/sem6/artificial_intelligence.pdf' },
        { id: '01CT0617', name: '01CT0617 - Human Centered Design (Mandatory)', file: '/pdfs/degree/sem6/human_centered_design.pdf' },
        { id: '01CT0601', name: '01CT0601 - Business Benchmark (Mandatory)', file: '/pdfs/degree/sem6/business_benchmark.pdf' },
        { id: '01GS0601', name: '01GS0601 - Cognitive Aptitude -2 (Mandatory)', file: '/pdfs/degree/sem6/cognitive_aptitude_2.pdf' },
        { id: '01CT0618', name: '01CT0618 - Sensors and IoT (Elective)', file: '/pdfs/degree/sem6/sensors_and_iot.pdf' },
        { id: '01CT0605', name: '01CT0605 - RF and Microwave Communication (Elective)', file: '/pdfs/degree/sem6/rf_and_microwave_communication.pdf' },
        { id: '01CT0611', name: '01CT0611 - Cloud Computing (Elective)', file: '/pdfs/degree/sem6/cloud_computing.pdf' },
        { id: '01CT0621', name: '01CT0621 - Computer Vision (Elective)', file: '/pdfs/degree/sem6/computer_vision.pdf' },
        { id: '01CT0623', name: '01CT0623 - Advanced Java (Elective)', file: '/pdfs/degree/sem6/advanced_java.pdf' },
        { id: '01CT0625', name: '01CT0625 - Advanced Web Technologies (Elective)', file: '/pdfs/degree/sem6/advanced_web_technologies.pdf' },
        { id: '01CT0619', name: '01CT0619 - Digital Design using Verilog (Elective)', file: '/pdfs/degree/sem6/digital_design_using_verilog.pdf' },
        { id: '01CT0610', name: '01CT0610 - Satellite Communication (Elective)', file: '/pdfs/degree/sem6/satellite_communication.pdf' },
        { id: '01CT0627', name: '01CT0627 - Cyber Security (Elective)', file: '/pdfs/degree/sem6/cyber_security.pdf' },
        { id: '01CT0622', name: '01CT0622 - Big Data Analytics (Elective)', file: '/pdfs/degree/sem6/big_data_analytics.pdf' },
        { id: '01CT0624', name: '01CT0624 - Theory of Computation (Elective)', file: '/pdfs/degree/sem6/theory_of_computation.pdf' },
        { id: '01CT0626', name: '01CT0626 - Game Programming and VR (Elective)', file: '/pdfs/degree/sem6/game_programming_and_vr.pdf' }
      ] },
      { id: 'sem7', name: 'Semester 7', subjects: [
        { id: '01CT0715', name: '01CT0715 - Capstone Project (Mandatory)', file: '/pdfs/degree/sem7/capstone_project.pdf' },
        { id: '01CT1702', name: '01CT1702 - Information Theory and Coding (Mandatory)', file: '/pdfs/degree/sem7/information_theory_and_coding.pdf' },
        { id: '01CT0716', name: '01CT0716 - Mobile and Pervasive computing (Mandatory)', file: '/pdfs/degree/sem7/mobile_and_pervasive_computing.pdf' },
        { id: '01CT0704', name: '01CT0704 - Management Information System (Mandatory)', file: '/pdfs/degree/sem7/management_information_system.pdf' },
        { id: '01CT0717', name: '01CT0717 - VLSI Physical Design (Elective)', file: '/pdfs/degree/sem7/vlsi_physical_design.pdf' },
        { id: '01CT0719', name: '01CT0719 - Adhoc Wireless Networks (Elective)', file: '/pdfs/degree/sem7/adhoc_wireless_networks.pdf' },
        { id: '01CT0720', name: '01CT0720 - Cloud Developing (Elective)', file: '/pdfs/degree/sem7/cloud_developing.pdf' },
        { id: '01CT0722', name: '01CT0722 - Deep Learning (Elective)', file: '/pdfs/degree/sem7/deep_learning.pdf' },
        { id: '01CT0724', name: '01CT0724 - Compiler Design (Elective)', file: '/pdfs/degree/sem7/compiler_design.pdf' },
        { id: '01CT0718', name: '01CT0718 - FPGA Based System Design (Elective)', file: '/pdfs/degree/sem7/fpga_based_system_design.pdf' },
        { id: '01CT0726', name: '01CT0726 - Software Defined Networks (Elective)', file: '/pdfs/degree/sem7/software_defined_networks.pdf' },
        { id: '01CT0721', name: '01CT0721 - Blockchain (Elective)', file: '/pdfs/degree/sem7/blockchain.pdf' },
        { id: '01CT0723', name: '01CT0723 - Information Retrieval and Natural Language Processing (Elective)', file: '/pdfs/degree/sem7/ir_and_nlp.pdf' },
        { id: '01CT0725', name: '01CT0725 - Advanced Database (Elective)', file: '/pdfs/degree/sem7/advanced_database.pdf' }
      ] },
      { id: 'sem8', name: 'Semester 8', subjects: [
        { id: '01CT1801', name: '01CT1801 - Project (Mandatory)', file: '/pdfs/degree/sem8/project.pdf' },
        { id: '01CT0818', name: '01CT0818 - Analog Circuit Design (Elective)', file: '/pdfs/degree/sem8/analog_circuit_design.pdf' },
        { id: '01CT0814', name: '01CT0814 - Spread spectrum communications (Elective)', file: '/pdfs/degree/sem8/spread_spectrum_communications.pdf' },
        { id: '01CT0828', name: '01CT0828 - Cloud Architecture (Elective)', file: '/pdfs/degree/sem8/cloud_architecture.pdf' },
        { id: '01CT0816', name: '01CT0816 - Advance Machine Learning (Elective)', file: '/pdfs/degree/sem8/advance_machine_learning.pdf' },
        { id: '01CT0821', name: '01CT0821 - Object Oriented Analysis and Design (Elective)', file: '/pdfs/degree/sem8/object_oriented_analysis_and_design.pdf' },
        { id: '01CT0819', name: '01CT0819 - RTOS (Elective)', file: '/pdfs/degree/sem8/rtos.pdf' },
        { id: '01CT0820', name: '01CT0820 - Introduction to 5G (Elective)', file: '/pdfs/degree/sem8/introduction_to_5g.pdf' },
        { id: '01CT0811', name: '01CT0811 - Introduction to DevOps Tools (Elective)', file: '/pdfs/degree/sem8/introduction_to_devops_tools.pdf' },
        { id: '01CT0817', name: '01CT0817 - Advance Data Analytics (Elective)', file: '/pdfs/degree/sem8/advance_data_analytics.pdf' },
        { id: '01CT0822', name: '01CT0822 - Soft Computing (Elective)', file: '/pdfs/degree/sem8/soft_computing.pdf' },
        { id: '01CT0823', name: '01CT0823 - Cloud Technical Essentials (Elective)', file: '/pdfs/degree/sem8/cloud_technical_essentials.pdf' },
        { id: '01CT0824', name: '01CT0824 - Security Essentials (Elective)', file: '/pdfs/degree/sem8/security_essentials.pdf' },
        { id: '01CT0825', name: '01CT0825 - Machine Learning Essentials (Elective)', file: '/pdfs/degree/sem8/machine_learning_essentials.pdf' },
        { id: '01CT0826', name: '01CT0826 - Human Computer Interaction (Elective)', file: '/pdfs/degree/sem8/human_computer_interaction.pdf' },
        { id: '01CT0827', name: '01CT0827 - Software Testing (Elective)', file: '/pdfs/degree/sem8/software_testing.pdf' }
      ] }
    ]
  }
];
