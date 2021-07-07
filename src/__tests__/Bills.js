import { fireEvent, screen, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { localStorageMock } from "../__mocks__/localStorage.js";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import Router from "../app/Router";
import Bills, {handleClickNewBill, handleClickIconEye} from "../containers/Bills.js";
import userEvent from "@testing-library/user-event";
import firebase from "../__mocks__/firebase";
import Firestore from "../app/Firestore";
import path from 'path/posix';


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test('Then Bill Page work corectly', () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      })
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      )
      const onNavigate = path => {
        document.body.innerHTML = ROUTES({path})
      }
      const billUi = BillsUI({data: []})
      document.body.innerHTML = billUi
      const bill = new Bills({data : bills, document: window.document, onNavigate})
      const handleCLickBill = jest.fn(bill.handleClickNewBill)
      const handleCLickEye = jest.fn(bill.handleClickIconEye)

      document.querySelector(`button[data-testid="btn-new-bill"]`).click(handleCLickBill)
      document.querySelectorAll(`div[data-testid="icon-eye"]`).forEach(icon =>{
        icon.click(handleCLickEye)
      })
      expect(handleCLickBill).toBeTruthy()
      expect(handleCLickEye).toBeTruthy()
    })

    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      })
      window.localStorage.setItem("user", JSON.stringify({
        type: "Employee",
        value: localStorageMock
      }))
      //to-do write expect expression
      const layoutOne = document.getElementById("layout-icon1")
      const layoutTwo = document.getElementById("layout-icon2")
      const button = document.querySelector("button[data-testid='btn-new-bill']")
      button.addEventListener('click', () =>{
        layoutOne.classList.remove("active-icon")
        layoutTwo.classList.add("active-icon")
      })
    })

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })

  describe("Given we are on bill page as Employee", ()=>{
    describe("when billUi is displayed", ()=>{
      test("then last bills are displayed", ()=>{
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        })
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        )
        const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
        const firestore = null
        const bill = new Bills({data : bills, document: window.document, onNavigate, firestore, localStorage: window.localStorage})
        bill.handleClickIconEye = jest.fn()
        bill.fileUrl = "fake url"
        const billUi = BillsUI({data: [bill]})
        document.body.innerHTML = billUi
        // const handleClickIconEye = jest.fn(bill.handleClickIconEye)
        // const button = document.querySelector(`button[data-testid="btn-new-bill"]`)
        const button = screen.getByTestId("icon-eye")
        // button.click(bill.handleClickIconEye)
        fireEvent.click(button)
        expect(bill.handleClickIconEye.mock.calls.length).toBe(1)
        waitFor(()=>{})
        // button.click(handleCLickBill)
        // expect(screen.getAllByText("Nouvelle note de frais")).toBeTruthy()
        // expect(handleCLickBill).toBeTruthy()
      })
    })
  })

  describe('when data is loading', () => {
    test('then loading component should be displayed', () => {
      const html = BillsUI({ data: bills, loading: true })
      document.body.innerHTML = html
      expect(document.getElementById("loading")).not.toBeNull()
    })
  })

  describe('when i click on the eye icon', () => {
    test('then open a modal box', () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      })
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      )
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      document.getElementById("eye").click()
      expect(document.getElementById("modaleFile")).not.toBeNull()
      expect(document.getElementById("exampleModalLongTitle").textContent).toEqual("Justificatif")
    })
  })

//     // test d'intégration GET
  describe("Given I am a user connected as Employee", () => {
    describe("When I navigate to Bills UI", () => {
      test("then fetches bills from mock API GET", async () => {
        const getSpy = jest.spyOn(firebase, "get")
        const bills = await firebase.get()
        expect(getSpy).toHaveBeenCalledTimes(1)
        expect(bills.data.length).toBe(4)
      })
      test("then fetches bills from an API and fails with 404 message error", async () => {
        firebase.get.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 404"))
        )
        const html = BillsUI({ error: "Erreur 404" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 404/)
        expect(message).toBeTruthy()
      })
      test("then fetches messages from an API and fails with 500 message error", async () => {
        firebase.get.mockImplementationOnce(() =>
          Promise.reject(new Error("Erreur 500"))
        )
        const html = BillsUI({ error: "Erreur 500" })
        document.body.innerHTML = html
        const message = await screen.getByText(/Erreur 500/)
        expect(message).toBeTruthy()
      })
    })
  })
})
