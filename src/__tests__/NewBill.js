import {fireEvent, screen} from "@testing-library/dom"
import { localStorageMock } from "../__mocks__/localStorage.js"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from "../views/BillsUI.js"
import firestore from "../app/Firestore"
import firebase from "../__mocks__/firebase"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import Firestore from "../app/Firestore"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then we change a file ", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      })
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      )
      const newBillUI = NewBillUI()
      document.body.innerHTML = newBillUI
      const onNavigate = (path) => {
        document.body.innerHTML = ROUTES({path})
      }
      const newBill = new NewBill({
        data : [],
        document: window.document,
        firestore: null,
        onNavigate,
        fileUrl: null,
        fileName: null
      })
      const handleChange = jest.fn(newBill.handleChangeFile)
      const Input = document.querySelector(`input[data-testid="file"]`)
      fireEvent.change(Input)
      Input.addEventListener("change", handleChange)
      expect(handleChange).toBeTruthy()
    })
  })
})

describe("Given I am connected as an employee", ()=>{
  describe("When I am on NewBill Page and submit the form", ()=>{
    test("then create a newBill", ()=>{
      Firestore.bills = jest.fn(()=>{
        return { add:()=> new Promise(()=>{}) }
      })
      const newBillUI = NewBillUI()
      document.body.innerHTML = newBillUI
      const onNavigate = (path) => {
        document.body.innerHTML = ROUTES({path})
      }
      const newBill = new NewBill({
        data : [],
        document: window.document,
        firestore,
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
      // expect(handleSubmit).toBeTruthy()
      // expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
    })
    test("then do not submit form", ()=>{
      Firestore.bills = jest.fn(()=>{
        return { add:()=> new Promise(()=>{}) }
      })
      const onNavigate = (path) => {
        document.body.innerHTML = ROUTES({path})
      }
      const newBillUI = NewBillUI()
      document.body.innerHTML = newBillUI
      const newBill = new NewBill({
        data : [],
        document: window.document,
        firestore,
        onNavigate,
        fileUrl: "none",
        fileName: "none"
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
      const form = screen.getByTestId("form-new-bill")
      // const handleSubmit = jest.fn(newBill.handleSubmit)
      // form.addEventListener("submit", handleSubmit)
      fireEvent.click(screen.getByText("Envoyer"))
      // expect(handleSubmit).toBeTruthy()
      // expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy()
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
//       firebase.post.mockImplementationOnce(() =>
//         Promise.reject(new Error("Erreur 404"))
//       )
//       const html = BillsUI({ error: "Erreur 500" })
//       document.body.innerHTML = html
//       const message = await screen.getByText(/Erreur 500/)
//       expect(message).toBeTruthy()
//     })
//   })
// })
