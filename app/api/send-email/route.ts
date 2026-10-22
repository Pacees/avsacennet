import { NextResponse } from "next/server"
import { Resend } from "resend"
import escapeHtml from 'escape-html'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {

    const body = await request.json();

    const escapeFromHtml = Object.fromEntries((Object.entries(body) as [string, string][]).map(([key, value]) => [key, escapeHtml(value)]));
    console.log(body);
    console.log(escapeFromHtml);

    const { email, customerName, apartmentTitle, checkIn, checkOut, totalPrice, phone, adults, children, deposit } = escapeFromHtml;

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
        <div>deneme</div>
      `,
    })

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("E-posta gönderim hatası:", error)
    return NextResponse.json({ error: "E-posta gönderilemedi." }, { status: 500 })
  }
}
