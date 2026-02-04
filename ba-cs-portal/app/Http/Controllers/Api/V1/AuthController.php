<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\ChangePasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Requests\UploadProfilePictureRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    /**
     * Authenticate user and return token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return $this->error('Invalid credentials', 401);
        }

        if (!$user->is_active) {
            return $this->error('Your account has been deactivated. Please contact administrator.', 403);
        }

        // Load supervisor relationship
        $user->load('supervisor');

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return $this->success([
            'user' => new UserResource($user),
            'token' => $token,
        ], 'Login successful');
    }

    /**
     * Logout user and revoke current token.
     */
    public function logout(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $user->currentAccessToken()->delete();

        return $this->success(null, 'Logged out successfully');
    }

    /**
     * Get authenticated user details.
     */
    public function me(): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();
        $user->load('supervisor');

        return $this->success(new UserResource($user));
    }

    /**
     * Change user password.
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $user->update([
            'password' => Hash::make($request->validated('new_password')),
        ]);

        // Revoke all tokens except current
        $user->tokens()->where('id', '!=', $user->currentAccessToken()->id)->delete();

        return $this->success(null, 'Password changed successfully');
    }

    /**
     * Update user profile (limited fields).
     */
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $user->update($request->validated());
        $user->load('supervisor');

        return $this->success(
            new UserResource($user),
            'Profile updated successfully'
        );
    }

    /**
     * Upload profile picture.
     */
    public function uploadPicture(UploadProfilePictureRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = Auth::user();

        // Delete old picture if exists
        if ($user->picture && Storage::exists($user->picture)) {
            Storage::delete($user->picture);
        }

        // Store new picture
        $path = $request->file('picture')->store('profile-pictures', 'public');

        $user->update(['picture' => $path]);
        $user->load('supervisor');

        return $this->success(
            new UserResource($user),
            'Profile picture uploaded successfully'
        );
    }
}
