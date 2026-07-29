import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, customerName, apartmentTitle, checkIn, checkOut, totalPrice, phone, adults, children, deposit } = await request.json()

    const upperCaseName = customerName.split(" ").map(kelime => kelime.charAt(0).toUpperCase() + kelime.slice(1)).join(" ");


    if (!email) {
      return NextResponse.json({ error: "E-posta adresi gerekli." }, { status: 400 })
    }

    const data = await resend.emails.send({
      from: "Avşa Cennet <bilgi@avsacennet.com>",
      replyTo: "avsacennet@gmail.com",
      to: [email, "avsacennet@gmail.com"],
      subject: "Rezervasyon Talebiniz Alınmıştır - Avşa Cennet",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 12px; padding: 24px;">
          <h2 style="color: #f97316; text-align: center;">Rezervasyon Talebiniz Alındı!</h2>
          <p>Merhaba <strong>${upperCaseName || "Değerli Misafirimiz"}</strong>,</p>
          <p>Avşa Cennet üzerinden yapmış olduğunuz konaklama talebi başarıyla tarafımıza ulaşmıştır. <br>Yerinizi ayırtmak için kapora tutarını EFT/Havale yapıp,
        dekont ve rezervasyonu yapan kişinin isim bilgisini WhatsApp üzerinden <strong>+90 (555) 635 41 55</strong> iletişim numaramızla paylaşınız.</p>
          
          <div style="background-color: #fff7ed; border-left: 4px solid #f97316; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <h4 style="margin: 0 0 8px 0; color: #9a3412;">Talep Detayları:</h4>
            <p style="margin: 4px 0;"><strong>Seçilen Daire:</strong> ${apartmentTitle} <a href="https://avsacennet.com/daire/${apartmentTitle}" target="_blank" style="color: #f97316; text-decoration: underline; font-weight: bold;">(Görüntülemek için tıklayın)</a></p>
            <p style="margin: 4px 0;"><strong>Giriş Tarihi:</strong> ${checkIn}</p>
            <p style="margin: 4px 0;"><strong>Çıkış Tarihi:</strong> ${checkOut}</p>
            <p style="margin: 4px 0;"> <strong>${adults}</strong> Yetişkin | <strong>${children}</strong> Çocuk </p>
            <p style="margin: 4px 0;"><strong>İletişim Numaranız:</strong> ${phone}</p>
            ${totalPrice ? `<p style="margin: 4px 0;"><strong>Tahmini Tutar:</strong> ₺${totalPrice.toLocaleString("tr-TR")}</p>` : ""} <br>

            ${deposit ? `<p style="margin: 4px 0;"><strong>Kapora Tutarı (EFT/Havale Yapınız): ₺${deposit.toLocaleString("tr-TR")}</strong></p>` : ""}
            <p style="margin: 4px 0;">TR88 0001 5001 5800 7328 3126 62<br>Selma Altun - Vakıfbank</p>
            <p style="margin: 4px 0;">İyi tatiller,</p>
            <p style="margin: 4px 0;"><strong>Avşa Cennet</strong></p>
          </div>

          <p style="text-align: center; color: #666; font-size: 13px; margin-top: 30px;">
            Avşa Cennet<br/>
            İletişim: +90 (555) 635 41 55 | avsacennet@gmail.com
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("E-posta gönderim hatası:", error)
    return NextResponse.json({ error: "E-posta gönderilemedi." }, { status: 500 })
  }
}