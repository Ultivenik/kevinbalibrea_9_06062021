import firebase from "../__mocks__/firebase.js"
import {fireEvent, screen} from "@testing-library/dom"
import { localStorageMock } from "../__mocks__/localStorage.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from "../views/BillsUI.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then we change a file ", () => {
      const newBillUI = NewBillUI()
      document.body.innerHTML = newBillUI
      const onNavigate = jest.fn()
      const newBill = new NewBill({
        data : [],
        document: window.document,
        onNavigate,
        fileUrl: null,
        fileName: null
      })
      const handleChange = jest.fn(newBill.handleChangeFile)
      const Input = document.querySelector(`input[data-testid="file"]`)
      Input.addEventListener("change", handleChange)
      expect(handleChange).toBeTruthy()
    })
  })
})

describe("Given I am connected as an employee", ()=>{
  describe("When I am on NewBill Page and submit the form", ()=>{
    test("then create a newBill", ()=>{
      const newBillUI = NewBillUI()
      document.body.innerHTML = newBillUI
      const onNavigate = jest.fn()
      const newBill = new NewBill({
        data : [],
        document: window.document,
        onNavigate,
        fileUrl: null,
        fileName: null
      })
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      })
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      )
      const button = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBill.handleSubmit)
      button.addEventListener("submit", handleSubmit)
      fireEvent.submit(button)
    })
    test("then do not submit form", ()=>{
      const onNavigate = jest.fn()
      const newBillUI = NewBillUI()
      document.body.innerHTML = newBillUI
      const newBill = new NewBill({
        data : [],
        document: window.document,
        onNavigate,
        fileUrl: "none",
        fileName: "none"
      })
      const form = screen.getByTestId("form-new-bill")
      const handleSubmit = jest.fn(newBill.handleSubmit)
      form.addEventListener("submit", handleSubmit)
      fireEvent.click(screen.getByText("Envoyer"))
    })
  })
})
// test d'intégration POST
// describe("Given I am a user connected as Employee", () => {
//   describe("When I create a new bill", () => {
//     test("Add bill to mock API POST", async () => {
//       const getSpy = jest.spyOn(firebase, "POST")
//       const datas = {
//         "id": "47qAXb6fIm2zOKkLzMro",
//         "vat": "80",
//         "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
//         "status": "pending",
//         "type": "Hôtel et logement",
//         "commentary": "séminaire billed",
//         "name": "encore",
//         "fileName": "preview-facture-free-201801-pdf-1.jpg",
//         "date": "2004-04-04",
//         "amount": 400,
//         "commentAdmin": "ok",
//         "email": "a@a",
//         "pct": 20
//       }
//       const bills = await firebase.post(datas)
//       expect(getSpy).toHaveBeenCalledTimes(1)
//       expect(bills.data.length).toBe(5)
//     })
//     test("Add bill to API and fails with 404 message error", async () => {
//       firebase.post.mockImplementationOnce(() =>
//         Promise.reject(new Error("Erreur 404"))
//       )
//       const html = BillsUI({ error: "Erreur 404" })
//       document.body.innerHTML = html
//       const message = await screen.getByText(/Erreur 404/)
//       expect(message).toBeTruthy()
//     })
//     test("Add bill to API and fails with 500 message error", async () => {
//       firebase.get.mockImplementationOnce(() =>
//         Promise.reject(new Error("Erreur 404"))
//       )
//       const html = BillsUI({ error: "Erreur 500" })
//       document.body.innerHTML = html
//       const message = await screen.getByText(/Erreur 500/)
//       expect(message).toBeTruthy()
//     })
//   })
// })

describe("Given I am a user connected as Employee", () => {
  describe("When I create a new bill", () => {
    test("Add bill to mock API POST", async () => {
      const getSpyPost = jest.spyOn(firebase, "post")
      const newBill = {
        "id": "qcCK3SlzCmvZAKRmHjaC",
        "status": "refused",
        "pct": 20,
        "amount": 200,
        "email": "a@a",
        "name": "test2",
        "vat": "",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2012-02-02",
        "commentAdmin": "pas la bonne facture",
        "commentary": "test2",
        "type": "Restaurants et bars",
        "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=4df6ed2c-12c8-42a2-b013-346c1346f732"
      }
      const bills = await firebase.post(newBill)
      expect(getSpyPost).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })
    test("Add bill to API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("Add bill to API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
