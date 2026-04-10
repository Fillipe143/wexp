package com.wexp;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.wexp.dto.GameDTO;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class ApiController {

  private final RestTemplate restTemplate = new RestTemplate();

  @GetMapping("/games")
  public List<GameDTO> searchGames(@RequestParam String term) {

    String url = "https://store.steampowered.com/api/storesearch/?term="
        + term + "&l=pt-BR&cc=BR";

    Map response = restTemplate.getForObject(url, Map.class);

    @SuppressWarnings("unchecked")
    List<Map<String, Object>> items = (List<Map<String, Object>>) response.get("items");

    List<GameDTO> games = new ArrayList<>();

    for (Map<String, Object> item : items) {
      int id = (int) item.get("id");
      String name = (String) item.get("name");
      String image = (String) item.get("tiny_image");

      games.add(new GameDTO(id, name, image));
    }

    return games;
  }

  @GetMapping("/games/{appId}/achievements")
  public String getAchievements(@PathVariable int appId) {

    String apiKey = "CC4315CE3B0CCA9D9F1B83C46253474C";

    String url = "https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/"
        + "?key=" + apiKey
        + "&appid=" + appId;

    return restTemplate.getForObject(url, String.class);
  }

  @GetMapping("/ping")
  public String ping() {
    return "pong";
  }
}