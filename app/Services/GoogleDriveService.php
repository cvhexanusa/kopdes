<?php

namespace App\Services;

use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;

class GoogleDriveService
{
    protected $client;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setClientId(config('google.client_id'));
        $this->client->setClientSecret(config('google.client_secret'));
        $this->client->setRedirectUri(config('google.redirect_uri') ?: route('nasabah.export-drive.callback'));
        $this->client->addScope(Drive::DRIVE);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');
    }

    /**
     * Get the authentication URL.
     */
    public function getAuthUrl($state = null)
    {
        if ($state) {
            $this->client->setState($state);
        }
        return $this->client->createAuthUrl();
    }

    /**
     * Authenticate using a code from the callback.
     */
    public function authenticate($code)
    {
        return $this->client->fetchAccessTokenWithAuthCode($code);
    }

    /**
     * Set the access token for the client.
     */
    public function setAccessToken($token)
    {
        $this->client->setAccessToken($token);
    }

    /**
     * Check if the access token is expired and refresh if possible.
     */
    public function isAccessTokenExpired()
    {
        return $this->client->isAccessTokenExpired();
    }

    /**
     * Get or create a folder by name.
     */
    public function getOrCreateFolder($folderName, $parentId = null)
    {
        $service = new Drive($this->client);
        
        $query = "name = '$folderName' and mimeType = 'application/vnd.google-apps.folder' and trashed = false";
        if ($parentId) {
            $query .= " and '$parentId' in parents";
        }

        $results = $service->files->listFiles([
            'q' => $query,
            'spaces' => 'drive',
            'fields' => 'files(id, name)',
        ]);

        if (count($results->getFiles()) > 0) {
            return $results->getFiles()[0]->getId();
        }

        // Create the folder
        $fileMetadata = new DriveFile([
            'name' => $folderName,
            'mimeType' => 'application/vnd.google-apps.folder',
        ]);

        if ($parentId) {
            $fileMetadata->setParents([$parentId]);
        }

        $folder = $service->files->create($fileMetadata, [
            'fields' => 'id',
        ]);

        return $folder->id;
    }

    /**
     * Upload a PDF content to a specific folder.
     */
    public function uploadPdf($fileName, $content, $folderId)
    {
        $service = new Drive($this->client);
        
        $fileMetadata = new DriveFile([
            'name' => $fileName,
            'parents' => [$folderId],
            'mimeType' => 'application/pdf',
        ]);

        $file = $service->files->create($fileMetadata, [
            'data' => $content,
            'mimeType' => 'application/pdf',
            'uploadType' => 'multipart',
            'fields' => 'id',
        ]);

        return $file->id;
    }
}
