<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style type="text/css">
        @page {
            size: A4;
            margin: 0.5in 0.6in 0.4in 0.8in;
        }
        
        body {
            font-family: 'Calibri', 'Arial', sans-serif;
            font-size: 10pt; /* Reduced font size as requested */
            line-height: 1.2;
            color: #000000;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }

        .header-container {
            position: relative;
            margin-bottom: 8pt;
        }

        .logo-center {
            text-align: center;
        }

        .no-urut {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 9pt;
        }

        .title-section {
            text-align: center;
            margin-bottom: 20pt;
        }

        .title-section b {
            display: block;
            font-size: 11pt;
            text-transform: uppercase;
        }

        .form-table {
            width: 100%;
            margin-bottom: 6pt; /* Increased margin between tables/rows as requested */
        }

        .form-table td {
            padding: 2pt 0;
            vertical-align: top;
        }

        .label-col { width: 160pt; }

        .checkbox-group {
            display: inline-block;
            margin-right: 35pt;
        }

        .checkbox {
            display: inline-block;
            width: 9pt;
            height: 9pt;
            border: 1px solid #000;
            margin-right: 5pt;
            vertical-align: middle;
            text-align: center;
            line-height: 9pt;
            font-size: 7pt;
        }

        .signature-section {
            margin-top: 25pt;
            width: 100%;
        }

        .signature-box {
            width: 50%;
            text-align: center;
            vertical-align: top;
        }

        .sig-spacer {
            height: 45pt;
        }

        .sig-line {
            border-bottom: 1px solid #000;
            width: 160pt;
            margin: 0 auto 3pt;
        }

        .catatan {
            margin-top: 20pt;
            font-size: 9pt;
        }

        .catatan ul {
            margin: 4pt 0;
            padding-left: 15pt;
        }

        .catatan li {
            margin-bottom: 3pt;
        }
    </style>
</head>
<body>
    <div class="header-container">
        <div class="no-urut">NO. URUT : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <div class="logo-center">
            @php
                $logoPath = public_path('assets/img/logo.jpg');
                $logoData = file_exists($logoPath) ? base64_encode(file_get_contents($logoPath)) : '';
            @endphp
            @if($logoData)
                <img src="data:image/jpeg;base64,{{ $logoData }}" width="90">
            @endif
        </div>
    </div>

    <div class="title-section">
        <b>FORMULIR PERMOHONAN KEANGGOTAAN</b>
        <b>KOPERASI DESA MERAH PUTIH SUKAMULYA</b>
        <b>KECAMATAN SUKALUYU KABUPATEN CIANJUR</b>
    </div>

    <p style="margin-bottom: 10pt;">Saya yang bertanda tangan dibawah ini :</p>

    <table class="form-table">
        <tr>
            <td class="label-col">Nama Lengkap</td>
            <td>{{ $nasabah->nama }}</td>
        </tr>
        <tr>
            <td class="label-col">Jenis Kelamin</td>
            <td>
                <span class="checkbox-group"><span class="checkbox">@if($nasabah->jenis_kelamin == 'Laki-laki') ✓ @endif</span> Laki-laki</span>
                <span class="checkbox-group"><span class="checkbox">@if($nasabah->jenis_kelamin == 'Perempuan') ✓ @endif</span> Perempuan</span>
            </td>
        </tr>
    </table>

    <table class="form-table">
        <tr>
            <td class="label-col">No. Identitas (Sesuai KTP)</td>
            <td>{{ $nasabah->nik }}</td>
        </tr>
    </table>

    <table class="form-table">
        <tr>
            <td class="label-col">Tempat & Tgl. Lahir</td>
            <td>{{ $nasabah->tempat_lahir }}, {{ $nasabah->tanggal_lahir }}</td>
        </tr>
    </table>

    <table class="form-table">
        <tr>
            <td class="label-col">Alamat (Sesuai KTP)</td>
            <td>{{ $nasabah->domisili }}</td>
        </tr>
    </table>

    <table class="form-table">
        <tr>
            <td width="30"></td>
            <td width="130">Kelurahan/Desa</td>
            <td width="160">{{ $nasabah->instansi->desa }}</td>
            <td width="80">Kecamatan</td>
            <td>{{ $nasabah->instansi->kecamatan ?? 'Sukaluyu' }}</td>
        </tr>
        <tr>
            <td></td>
            <td>Kotamadya/Kabupaten</td>
            <td>Cianjur</td>
            <td>Kode Pos</td>
            <td>43284</td>
        </tr>
    </table>

    <table class="form-table">
        <tr>
            <td class="label-col">No. Telpon / WA</td>
            <td width="160">{{ $nasabah->no_handphone }}</td>
            <td width="50">Email</td>
            <td>{{ $nasabah->email ?? '-' }}</td>
        </tr>
    </table>

    <table class="form-table">
        <tr>
            <td class="label-col">Nama Perusahaan / Instansi</td>
            <td>{{ $nasabah->instansi->nama }}</td>
        </tr>
        <tr>
            <td class="label-col">Alamat Perusahaan / Instansi</td>
            <td>{{ $nasabah->instansi->desa }}, {{ $nasabah->instansi->kecamatan }}</td>
        </tr>
        <tr>
            <td class="label-col">No. Telepon Perusahaan</td>
            <td>-</td>
        </tr>
    </table>

    <table class="form-table" style="margin-top: 10pt;">
        <tr>
            <td class="label-col">Simpanan Pokok</td>
            <td>Rp. 50.000,-</td>
        </tr>
        <tr>
            <td class="label-col">Simpanan Wajib</td>
            <td>Rp. 10.000,- /Bulan</td>
        </tr>
        <tr>
            <td class="label-col">Simpanan Sukarela</td>
            <td>Rp.</td>
        </tr>
    </table>

    <p style="margin-top: 15pt; text-align: justify; line-height: 1.4;">
        Serta memenuhi semua ketentuan yang tertera dalam Anggaran Dasar, Anggaran Rumah Tangga, Peraturan khusus dan kebijakan lainnya yang ada di KOPERASI DESA MERAH PUTIH SUKAMULYA KECAMATAN SUKALUYU.
    </p>
    <p style="margin-top: 5pt;">
        Demikian Formulir ini saya isi dengan keterangan yang benar.
    </p>

    <table class="signature-section">
        <tr>
            <td class="signature-box">
                <p>Mengetahui/menyetujui,</p>
                <p style="margin-top: 8pt;">2026</p>
                <p>Pengurus KDMP Sukamulya</p>
                <div class="sig-spacer"></div>
                <div class="sig-line"></div>
                <p style="font-size: 8.5pt;">Nama Jelas dan stempel</p>
            </td>
            <td class="signature-box">
                <p>Sukamulya, ............................................ 2026</p>
                <p style="margin-top: 20pt;">Pemohon</p>
                <div class="sig-spacer" style="height: 38pt;"></div>
                <div class="sig-line" style="font-weight: bold;">{{ $nasabah->nama }}</div>
                <p style="font-size: 8.5pt;">Nama Jelas dan Tanda Tangan</p>
            </td>
        </tr>
    </table>

    <div class="catatan">
        <b>Catatan :</b>
        <ul>
            <li>Lampirkan Potocopy KTP (1 Lembar)</li>
            <li>Simpanan Pokok disetorkan langsung ke Petugas atau Transfer ke Nomor Rekening ____________ atas nama Koperasi Desa Merah Putih Sukamulya Kecamatan Sukaluyu.</li>
        </ul>
    </div>
</body>
</html>