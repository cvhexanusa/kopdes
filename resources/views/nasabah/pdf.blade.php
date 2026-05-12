<!DOCTYPE html>
<html>
<head>
    <title>Detail Nasabah - {{ $nasabah->nama }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            line-height: 1.6;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 20px;
            text-transform: uppercase;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            background-color: #f4f4f4;
            padding: 5px 10px;
            font-weight: bold;
            border-left: 4px solid #333;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table td {
            padding: 8px;
            vertical-align: top;
        }
        .label {
            width: 30%;
            font-weight: bold;
            color: #666;
        }
        .content {
            width: 70%;
        }
        .photo-container {
            margin-top: 20px;
            text-align: center;
        }
        .photo-box {
            display: inline-block;
            width: 45%;
            margin: 0 2%;
            text-align: left;
        }
        .photo-box h3 {
            font-size: 12px;
            margin-bottom: 5px;
        }
        .photo {
            width: 100%;
            height: 200px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
            text-align: center;
            line-height: 200px;
            color: #999;
        }
        .footer {
            margin-top: 50px;
            text-align: right;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Data Registrasi Nasabah</h1>
        <p>{{ $nasabah->instansi->nama }}</p>
    </div>

    <div class="section">
        <div class="section-title">Informasi Pribadi</div>
        <table>
            <tr>
                <td class="label">Nama Lengkap</td>
                <td class="content">: {{ $nasabah->nama }}</td>
            </tr>
            <tr>
                <td class="label">NIK</td>
                <td class="content">: {{ $nasabah->nik }}</td>
            </tr>
            <tr>
                <td class="label">Tempat, Tanggal Lahir</td>
                <td class="content">: {{ $nasabah->tempat_lahir }}, {{ $nasabah->tanggal_lahir }}</td>
            </tr>
            <tr>
                <td class="label">Nomor Handphone</td>
                <td class="content">: {{ $nasabah->no_handphone }}</td>
            </tr>
            <tr>
                <td class="label">Pekerjaan</td>
                <td class="content">: {{ $nasabah->pekerjaan }}</td>
            </tr>
            <tr>
                <td class="label">Alamat Domisili</td>
                <td class="content">: {{ $nasabah->domisili }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Lampiran Dokumen</div>
        <div class="photo-container">
            <div class="photo-box">
                <h3>Foto KTP</h3>
                <div class="photo">
                    @if($nasabah->foto_ktp)
                        [Dokumen Terlampir]
                    @else
                        [Tidak Ada Foto]
                    @endif
                </div>
            </div>
            <div class="photo-box">
                <h3>Foto Kartu Keluarga</h3>
                <div class="photo">
                    @if($nasabah->foto_kk)
                        [Dokumen Terlampir]
                    @else
                        [Tidak Ada Foto]
                    @endif
                </div>
            </div>
        </div>
    </div>

    <div className="footer">
        Dicetak pada: {{ date('d F Y, H:i') }}<br>
        Sistem Manajemen Nasabah - Kopdes
    </div>
</body>
</html>
