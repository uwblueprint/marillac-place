import IHelloService from "../interface/helloInterface";


class HelloService implements IHelloService {
    hello(): string {
        return "Hello, World!";
    }
}

export default HelloService;