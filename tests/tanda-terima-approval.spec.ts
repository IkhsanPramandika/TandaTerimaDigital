import { test, expect } from "../fixtures/auth.fixture";
import { TandaTerimaPage } from "../pages/TandaTerimaPage";

/**
 * Approval Berjenjang Tanda Terima — tests/tanda-terima-approval.spec.ts
 * Feature doc: docs/features/tanda-terima.md (TC-008)
 * Jira: P26-1387
 *
 * Menggunakan fixtures/auth.fixture.ts:
 * - requesterPage membuat & mengajukan tanda terima
 * - approver1Page & approver2Page menyetujui secara berurutan (min 2 approver)
 *
 * Flow: Requester -> Approver1 -> Approver2 -> Approved
 */

test.describe("Approval Berjenjang Tanda Terima", () => {
  // ---------------------------------------------------------------------------
  // POSITIVE
  // ---------------------------------------------------------------------------
  test("TC-001: [P26-1387] Approval berjenjang minimal 2 approver @regression @approver", async ({
    requesterPage,
    approver1Page,
    approver2Page,
  }) => {
    const penerima = `Approval TT ${Date.now()}`;

    // 1. Requester membuat & mengajukan tanda terima
    const ttRequester = new TandaTerimaPage(requesterPage);
    await ttRequester.goto();
    await ttRequester.tambahTandaTerima(penerima, "Butuh approval berjenjang");
    await ttRequester.expectSuccess();

    // 2. Approver level 1 (Atasan 1) menyetujui
    const ttApprover1 = new TandaTerimaPage(approver1Page);
    await ttApprover1.goto();
    await ttApprover1.openDetail(penerima);
    await ttApprover1.setujui();

    // Expected: setelah approver1, status masih dalam proses (belum final)
    await ttApprover1.expectStatus(
      /proses|pending|menunggu|disetujui atasan 1|mengetahui/i,
    );

    // 3. Approver level 2 (Mengetahui) menyetujui (approver terakhir dari minimal 2)
    const ttApprover2 = new TandaTerimaPage(approver2Page);
    await ttApprover2.goto();
    await ttApprover2.openDetail(penerima);
    await ttApprover2.setujui();

    // Expected: status akhir menjadi Disetujui
    await ttApprover2.expectStatus(/approved|disetujui|selesai/i);
  });

  test("TC-002: [P26-1451] Atasan 1 menyetujui dengan deskripsi wajib terisi @regression @approver", async ({
    requesterPage,
    approver1Page,
  }) => {
    const penerima = `Approval Deskripsi ${Date.now()}`;

    // 1. Requester membuat & mengajukan tanda terima
    const ttRequester = new TandaTerimaPage(requesterPage);
    await ttRequester.goto();
    await ttRequester.tambahTandaTerima(penerima, "Uji deskripsi persetujuan");
    await ttRequester.expectSuccess();

    // 2. Atasan 1 membuka detail
    const ttApprover1 = new TandaTerimaPage(approver1Page);
    await ttApprover1.goto();
    await ttApprover1.openDetail(penerima);
    test.skip(
      (await ttApprover1.deskripsiApprovalInput.count()) === 0,
      "Field Deskripsi persetujuan tidak tersedia di UI.",
    );

    // Step: setujui dengan deskripsi terisi
    await ttApprover1.setujuiDenganDeskripsi("Disetujui, dokumen lengkap.");

    // Expected: status berpindah dari Menunggu Persetujuan
    await ttApprover1.expectStatus(
      /disetujui atasan 1|mengetahui|proses|disetujui/i,
    );
  });

  // ---------------------------------------------------------------------------
  // NEGATIVE
  // ---------------------------------------------------------------------------
  test("TC-003: [P26-1387] Approver menolak menghentikan alur approval @regression @approver", async ({
    requesterPage,
    approver1Page,
  }) => {
    const penerima = `Reject TT ${Date.now()}`;

    // 1. Requester membuat & mengajukan tanda terima
    const ttRequester = new TandaTerimaPage(requesterPage);
    await ttRequester.goto();
    await ttRequester.tambahTandaTerima(penerima, "Akan ditolak approver 1");
    await ttRequester.expectSuccess();

    // 2. Approver level 1 menolak
    const ttApprover1 = new TandaTerimaPage(approver1Page);
    await ttApprover1.goto();
    await ttApprover1.openDetail(penerima);
    await ttApprover1.tolak();

    // Expected: status menjadi Rejected/Ditolak, alur berhenti
    await ttApprover1.expectStatus(/rejected|ditolak/i);
  });

  test("TC-004: [P26-1451] Atasan 1 gagal menyetujui saat deskripsi dikosongkan @regression @approver", async ({
    requesterPage,
    approver1Page,
  }) => {
    const penerima = `Deskripsi Kosong ${Date.now()}`;

    // 1. Requester membuat & mengajukan tanda terima
    const ttRequester = new TandaTerimaPage(requesterPage);
    await ttRequester.goto();
    await ttRequester.tambahTandaTerima(penerima, "Uji deskripsi wajib");
    await ttRequester.expectSuccess();

    // 2. Atasan 1 membuka detail
    const ttApprover1 = new TandaTerimaPage(approver1Page);
    await ttApprover1.goto();
    await ttApprover1.openDetail(penerima);
    test.skip(
      (await ttApprover1.deskripsiApprovalInput.count()) === 0,
      "Field Deskripsi persetujuan tidak tersedia di UI.",
    );

    // Step: setujui tanpa mengisi deskripsi
    await ttApprover1.setujui();

    // Expected: notifikasi sukses tidak muncul (deskripsi wajib)
    await expect(ttApprover1.successNotification).toHaveCount(0);
  });

  // ---------------------------------------------------------------------------
  // EDGE
  // ---------------------------------------------------------------------------
  test("TC-005: [P26-1387] Approval berjenjang penuh hingga 5 approver @regression @approver", async ({
    requesterPage,
    approver1Page,
    approver2Page,
    approver3Page,
    approver4Page,
    approver5Page,
  }) => {
    // Lewati bila approver 3-5 tidak dikonfigurasi (min 2, max 5).
    test.skip(
      !process.env.APPROVER3_USERNAME ||
        !process.env.APPROVER4_USERNAME ||
        !process.env.APPROVER5_USERNAME,
      "Approver level 3-5 tidak dikonfigurasi.",
    );

    const penerima = `Approval Penuh ${Date.now()}`;

    // 1. Requester membuat & mengajukan tanda terima
    const ttRequester = new TandaTerimaPage(requesterPage);
    await ttRequester.goto();
    await ttRequester.tambahTandaTerima(penerima, "Approval 5 level");
    await ttRequester.expectSuccess();

    // 2. Setiap approver menyetujui secara berurutan
    const approverPages = [
      approver1Page,
      approver2Page,
      approver3Page,
      approver4Page,
      approver5Page,
    ];
    for (const approverPage of approverPages) {
      const ttApprover = new TandaTerimaPage(approverPage);
      await ttApprover.goto();
      await ttApprover.openDetail(penerima);
      await ttApprover.setujui();
    }

    // Expected: status akhir menjadi Disetujui setelah approver terakhir
    const ttFinal = new TandaTerimaPage(approver5Page);
    await ttFinal.goto();
    await ttFinal.openDetail(penerima);
    await ttFinal.expectStatus(/approved|disetujui|selesai/i);
  });

  test("TC-006: [P26-1387] Approver level 2 tidak dapat menyetujui sebelum Atasan 1 @regression @approver", async ({
    requesterPage,
    approver2Page,
  }) => {
    const penerima = `Urutan Approval ${Date.now()}`;

    // 1. Requester membuat & mengajukan tanda terima
    const ttRequester = new TandaTerimaPage(requesterPage);
    await ttRequester.goto();
    await ttRequester.tambahTandaTerima(penerima, "Uji urutan approval");
    await ttRequester.expectSuccess();

    // 2. Approver level 2 mencoba membuka detail sebelum Atasan 1 menyetujui
    const ttApprover2 = new TandaTerimaPage(approver2Page);
    await ttApprover2.goto();
    await ttApprover2.openDetail(penerima);

    // Expected: tombol setujui tidak tersedia/disabled untuk approver 2
    await ttApprover2.expectApproveUnavailable();
  });
});
