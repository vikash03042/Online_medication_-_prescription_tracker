 let isLoginMode = true;
        const API_BASE_URL = 'http://localhost:8080/api/auth';

        // Toggle between login and signup
        function toggleForm() {
            isLoginMode = !isLoginMode;
            const formTitle = document.getElementById('formTitle');
            const toggleBtn = document.getElementById('toggleBtn');
            const submitBtn = document.getElementById('submitBtn');
            const fullNameGroup = document.getElementById('fullNameGroup');
            const roleSelect = document.getElementById('role');

            if (isLoginMode) {
                formTitle.textContent = 'Login';
                toggleBtn.textContent = "Don't have an account? Sign up";
                submitBtn.textContent = 'Login';
                fullNameGroup.classList.add('hidden');
                roleSelect.disabled = false;
                hideRoleFields();
            } else {
                formTitle.textContent = 'Sign Up';
                toggleBtn.textContent = 'Already have an account? Login';
                submitBtn.textContent = 'Sign Up';
                fullNameGroup.classList.remove('hidden');
                roleSelect.disabled = false;
                showRoleFields();
            }

            clearAlerts();
            clearForm();
        }

        // Show/hide role-specific fields
        document.getElementById('role').addEventListener('change', function() {
            if (!isLoginMode) {
                showRoleFields();
            }
        });

        function showRoleFields() {
            const role = document.getElementById('role').value;
            const doctorFields = document.getElementById('doctorFields');
            const pharmacistFields = document.getElementById('pharmacistFields');

            doctorFields.classList.add('hidden');
            pharmacistFields.classList.add('hidden');

            if (role === 'DOCTOR') {
                doctorFields.classList.remove('hidden');
            } else if (role === 'PHARMACIST') {
                pharmacistFields.classList.remove('hidden');
            }
        }

        function hideRoleFields() {
            document.getElementById('doctorFields').classList.add('hidden');
            document.getElementById('pharmacistFields').classList.add('hidden');
        }

        // Handle form submission
        async function handleSubmit() {
            clearAlerts();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const role = document.getElementById('role').value;

            if (!email || !password) {
                showError('Please fill in all required fields');
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            submitBtn.classList.add('loading');
            submitBtn.textContent = 'Processing...';

            try {
                if (isLoginMode) {
                    await login(email, password);
                } else {
                    await register(email, password, role);
                }
            } catch (error) {
                showError(error.message || 'An error occurred');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.textContent = isLoginMode ? 'Login' : 'Sign Up';
            }
        }

        // Login function
        async function login(email, password) {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('email', data.email);
                localStorage.setItem('fullName', data.fullName);
                showSuccess('Login successful! Redirecting...');
                
                setTimeout(() => {
                    redirectToDashboard(data.role);
                }, 1500);
            } else {
                throw new Error(data.message || 'Login failed');
            }
        }

        // Register function
        async function register(email, password, role) {
            const fullName = document.getElementById('fullName').value.trim();

            if (!fullName) {
                throw new Error('Please enter your full name');
                return;
            }

            const payload = {
                email,
                password,
                fullName,
                role
            };

            // Add role-specific fields
            if (role === 'DOCTOR') {
                payload.medicalLicenseNumber = document.getElementById('medicalLicenseNumber').value.trim();
                payload.specialization = document.getElementById('specialization').value.trim();
                
                if (!payload.medicalLicenseNumber || !payload.specialization) {
                    throw new Error('Please fill in all doctor-specific fields');
                    return;
                }
            } else if (role === 'PHARMACIST') {
                payload.shopName = document.getElementById('shopName').value.trim();
                payload.licenseNumber = document.getElementById('licenseNumber').value.trim();
                payload.shopAddress = document.getElementById('shopAddress').value.trim();
                
                if (!payload.shopName || !payload.licenseNumber || !payload.shopAddress) {
                    throw new Error('Please fill in all pharmacist-specific fields');
                    return;
                }
            }

            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('email', data.email);
                localStorage.setItem('fullName', data.fullName);
                showSuccess('Registration successful! Redirecting...');
                
                setTimeout(() => {
                    redirectToDashboard(data.role);
                }, 1500);
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        }

        // Redirect to appropriate dashboard
        function redirectToDashboard(role) {
            switch(role) {
                case 'ADMIN':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'DOCTOR':
                    window.location.href = 'doctor-dashboard.html';
                    break;
                case 'PATIENT':
                    window.location.href = 'patient-dashboard.html';
                    break;
                case 'PHARMACIST':
                    window.location.href = 'pharmacist-dashboard.html';
                    break;
                default:
                    window.location.href = 'dashboard.html';
            }
        }

        // Alert functions
        function showError(message) {
            const errorAlert = document.getElementById('errorAlert');
            errorAlert.textContent = message;
            errorAlert.classList.add('show');
        }

        function showSuccess(message) {
            const successAlert = document.getElementById('successAlert');
            successAlert.textContent = message;
            successAlert.classList.add('show');
        }

        function clearAlerts() {
            document.getElementById('errorAlert').classList.remove('show');
            document.getElementById('successAlert').classList.remove('show');
        }

        // Clear form
        function clearForm() {
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('fullName').value = '';
            document.getElementById('medicalLicenseNumber').value = '';
            document.getElementById('specialization').value = '';
            document.getElementById('shopName').value = '';
            document.getElementById('licenseNumber').value = '';
            document.getElementById('shopAddress').value = '';
        }

        // Check if already logged in
        window.onload = function() {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            
            if (token && role) {
                redirectToDashboard(role);
            }
        };

        // Handle Enter key
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSubmit();
            }
        });